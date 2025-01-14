import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSupplierSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
});

export async function PATCH(
  req: Request,
  { params }: { params: { supplierId: string } }
) {
  try {
    const json = await req.json();
    const body = updateSupplierSchema.parse(json);

    const supplier = await db.supplier.update({
      where: {
        id: params.supplierId,
      },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
      },
    });

    revalidateTag("suppliers");
    return NextResponse.json(supplier);
  } catch (error) {
    console.error("[SUPPLIER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { supplierId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if supplier exists and has no products
    const supplier = await db.supplier.findUnique({
      where: { id: params.supplierId },
      include: { products: { select: { id: true } } }
    });

    if (!supplier) {
      return new NextResponse("Supplier not found", { status: 404 });
    }

    if (supplier.products.length > 0) {
      return new NextResponse(
        "Cannot delete supplier with existing products",
        { status: 400 }
      );
    }

    await db.supplier.delete({
      where: { id: params.supplierId },
    });

    revalidateTag("suppliers");
    return NextResponse.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("[SUPPLIER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}