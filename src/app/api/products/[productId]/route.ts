import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  sku: z.string().min(1),
  price: z.number().min(0),
  quantity: z.number().min(0),
  minQuantity: z.number().min(0),
  categoryId: z.string().min(1),
  supplierId: z.string().min(1),
  status: z.enum(["GOOD", "REASONABLE", "POOR", "DAMAGED"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = await Promise.resolve(params.productId);
    const json = await req.json();
    const body = updateProductSchema.parse(json);

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Check if SKU is unique (if changed)
    if (body.sku !== existingProduct.sku) {
      const skuExists = await db.product.findUnique({
        where: { sku: body.sku },
      });

      if (skuExists) {
        return new NextResponse("SKU already exists", { status: 400 });
      }
    }

    // Check if category exists
    const category = await db.category.findUnique({
      where: { id: body.categoryId },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 400 });
    }

    // Check if supplier exists
    const supplier = await db.supplier.findUnique({
      where: { id: body.supplierId },
    });

    if (!supplier) {
      return new NextResponse("Supplier not found", { status: 400 });
    }

    const product = await db.product.update({
      where: {
        id: productId,
      },
      data: body,
      include: {
        category: true,
        supplier: true,
      },
    });

    revalidateTag("products");
    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }

    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Check if product exists and has no transactions
    const product = await db.product.findUnique({
      where: { id: params.productId },
      include: {
        transactions: {
          select: { id: true },
        },
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    if (product.transactions.length > 0) {
      return new NextResponse(
        "Cannot delete product with existing transactions",
        { status: 400 }
      );
    }

    await db.product.delete({
      where: { id: params.productId },
    });

    revalidateTag("products");
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}