import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const createTransactionSchema = z.object({
  type: z.enum(["STOCK_IN", "STOCK_OUT", "ADJUSTMENT"]),
  note: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = createTransactionSchema.parse(json);

    // Validate products exist and have enough stock for STOCK_OUT
    if (body.type === "STOCK_OUT") {
      for (const item of body.items) {
        const product = await db.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          return new NextResponse(`Product not found: ${item.productId}`, { status: 400 });
        }

        if (product.quantity < item.quantity) {
          return new NextResponse(`Insufficient stock for product: ${product.name}`, { status: 400 });
        }
      }
    }

    // Create transaction and items
    const transaction = await db.transaction.create({
      data: {
        type: body.type,
        note: body.note,
        userId: session.user.id,
        items: {
          create: body.items,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product quantities
    for (const item of transaction.items) {
      const quantityChange = transaction.type === "STOCK_IN" ? item.quantity : -item.quantity;
      
      await db.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            increment: quantityChange,
          },
        },
      });
    }

    // Mark transaction as completed
    const updatedTransaction = await db.transaction.update({
      where: { id: transaction.id },
      data: { status: "COMPLETED" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    revalidateTag("transactions");
    revalidateTag("products");
    return NextResponse.json(updatedTransaction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }

    console.error("[TRANSACTIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const transactions = await db.transaction.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("[TRANSACTIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 