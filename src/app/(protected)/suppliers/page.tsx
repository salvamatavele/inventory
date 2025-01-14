import { db } from "@/lib/db";
import { SuppliersClient } from "./suppliers-client";
import { labels } from "@/config/labels";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

const getSuppliers = unstable_cache(
  async () => {
    return db.supplier.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  },
  ["suppliers-list"],
  {
    revalidate: 60,
    tags: ["suppliers"],
  }
);

export default async function SuppliersPage() {
  return (
    <Suspense fallback={<SuppliersLoading />}>
      <SuppliersContent />
    </Suspense>
  );
}

function SuppliersLoading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{labels.suppliers.title}</h2>
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

async function SuppliersContent() {
  const suppliers = await getSuppliers();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{labels.suppliers.title}</h2>
      </div>
      <SuppliersClient data={suppliers} />
    </div>
  );
} 