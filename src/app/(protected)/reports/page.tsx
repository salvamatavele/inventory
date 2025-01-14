import { db } from "@/lib/db";
import { ReportsClient } from "./reports-client";
import { labels } from "@/config/labels";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

const getReportData = unstable_cache(
  async () => {
    const [transactions, products, categories, suppliers] = await Promise.all([
      db.transaction.findMany({
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.product.findMany({
        include: {
          category: true,
          supplier: true,
        },
      }),
      db.category.findMany({
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      }),
      db.supplier.findMany({
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      }),
    ]);

    return {
      transactions,
      products,
      categories,
      suppliers,
    };
  },
  ["reports"],
  {
    revalidate: 60,
    tags: ["reports"],
  }
);

export default async function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
      </div>
      <Suspense fallback={<ReportsLoading />}>
        <ReportsContent />
      </Suspense>
    </div>
  );
}

async function ReportsContent() {
  const data = await getReportData();

  return <ReportsClient data={data} />;
}

function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[120px] rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-[300px] rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    </div>
  );
} 