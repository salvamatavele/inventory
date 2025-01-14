import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import {
  CubeIcon,
  TagIcon,
  TruckIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { labels } from "@/config/labels";
import { Suspense } from "react";
import DashboardLoading from "./loading";
import { unstable_cache } from "next/cache";

const getStats = unstable_cache(
  async () => {
    const [
      productsCount,
      categoriesCount,
      suppliersCount,
      recentTransactions,
      lowStockProducts,
    ] = await Promise.all([
      db.product.count(),
      db.category.count(),
      db.supplier.count(),
      db.transaction.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      }),
      db.product.findMany({
        where: {
          quantity: {
            lte: 5,
          },
        },
        take: 5,
        orderBy: { quantity: "asc" },
      }),
    ]);

    return {
      productsCount,
      categoriesCount,
      suppliersCount,
      recentTransactions,
      lowStockProducts,
    };
  },
  ["dashboard-stats"],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ["dashboard"],
  }
);

export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{labels.dashboard.title}</h2>
        <p className="text-muted-foreground">
          {labels.dashboard.overview}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <CubeIcon className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {labels.dashboard.totalProducts}
              </p>
              <p className="text-2xl font-bold">{stats.productsCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <TagIcon className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {labels.dashboard.categories}
              </p>
              <p className="text-2xl font-bold">{stats.categoriesCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <TruckIcon className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {labels.dashboard.suppliers}
              </p>
              <p className="text-2xl font-bold">{stats.suppliersCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-4">
            <ArrowTrendingUpIcon className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {labels.dashboard.lowStock}
              </p>
              <p className="text-2xl font-bold">{stats.lowStockProducts.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border">
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4">{labels.dashboard.recentTransactions}</h3>
            <div className="space-y-4">
              {stats.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">
                      {labels.transactions.type[transaction.type]} {labels.common.by} {transaction.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.items.length} {labels.dashboard.items}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleDateString("pt-PT")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border">
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4">{labels.dashboard.lowStockAlert}</h3>
            <div className="space-y-4">
              {stats.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{product.quantity}</span>{" "}
                    {labels.dashboard.inStock}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 