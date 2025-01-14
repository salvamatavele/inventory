import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const createProductSchema = z.object({
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

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = createProductSchema.parse(json);

    // Check if SKU is unique
    const skuExists = await db.product.findUnique({
      where: { sku: body.sku },
    });

    if (skuExists) {
      return new NextResponse("SKU already exists", { status: 400 });
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

    const product = await db.product.create({
      data: body,
      include: {
        category: true,
        supplier: true,
      },
    });

    revalidateTag("products");
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }

    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await db.product.findMany({
      include: {
        category: true,
        supplier: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 