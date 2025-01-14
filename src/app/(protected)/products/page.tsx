import { db } from "@/lib/db";
import { ProductsClient } from "./products-client";
import { labels } from "@/config/labels";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

const getProducts = unstable_cache(
  async () => {
    return db.product.findMany({
      include: {
        category: true,
        supplier: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  ["products-list"],
  {
    revalidate: 60,
    tags: ["products"],
  }
);

export default async function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsLoading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{labels.products.title}</h2>
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

async function ProductsContent() {
  const products = await getProducts();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{labels.products.title}</h2>
      </div>
      <ProductsClient data={products} />
    </div>
  );
} 