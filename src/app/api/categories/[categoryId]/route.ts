import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const json = await req.json();
    const body = updateCategorySchema.parse(json);

    const category = await db.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name: body.name,
        description: body.description,
      },
    });

    revalidateTag("categories");
    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if category exists and has no products
    const category = await db.category.findUnique({
      where: { id: params.categoryId },
      include: { products: { select: { id: true } } }
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    if (category.products.length > 0) {
      return new NextResponse(
        "Cannot delete category with existing products",
        { status: 400 }
      );
    }

    await db.category.delete({
      where: { id: params.categoryId },
    });

    revalidateTag("categories");
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}