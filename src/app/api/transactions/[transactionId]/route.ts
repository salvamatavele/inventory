import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transaction = await db.transaction.findUnique({
      where: { id: params.transactionId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 });
    }

    // Only allow deletion of PENDING transactions
    if (transaction.status !== "PENDING") {
      return new NextResponse(
        "Only pending transactions can be deleted",
        { status: 400 }
      );
    }

    // Delete transaction and its items
    await db.transaction.delete({
      where: { id: params.transactionId },
    });

    revalidateTag("transactions");
    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("[TRANSACTION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
