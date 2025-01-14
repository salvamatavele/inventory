import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSupplierSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = createSupplierSchema.parse(json);

    const supplier = await db.supplier.create({
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
    console.error("[SUPPLIERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const suppliers = await db.supplier.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("[SUPPLIERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 