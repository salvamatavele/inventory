import { db } from "@/lib/db";
import { TransactionsClient } from "./transactions-client";
import { labels } from "@/config/labels";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

const getTransactions = unstable_cache(
  async () => {
    return db.transaction.findMany({
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
  },
  ["transactions-list"],
  {
    revalidate: 60,
    tags: ["transactions"],
  }
);

const getProducts = unstable_cache(
  async () => {
    return db.product.findMany({
      where: {
        quantity: {
          gt: 0,
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  },
  ["products-list"],
  {
    revalidate: 60,
    tags: ["products"],
  }
);

export default async function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsLoading />}>
      <TransactionsContent />
    </Suspense>
  );
}

function TransactionsLoading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{labels.transactions.title}</h2>
      </div>
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function TransactionsContent() {
  const [transactions, products] = await Promise.all([
    getTransactions(),
    getProducts(),
  ]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{labels.transactions.title}</h2>
      </div>
      <TransactionsClient data={transactions} products={products} />
    </div>
  );
} 