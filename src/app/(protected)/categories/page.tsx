import { db } from "@/lib/db";
import { CategoriesClient } from "./categories-client";
import { labels } from "@/config/labels";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

const getCategories = unstable_cache(
  async () => {
    return db.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  },
  ["categories-list"],
  {
    revalidate: 60,
    tags: ["categories"],
  }
);

export default async function CategoriesPage() {
  return (
    <Suspense fallback={<CategoriesLoading />}>
      <CategoriesContent />
    </Suspense>
  );
}

function CategoriesLoading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{labels.categories.title}</h2>
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

async function CategoriesContent() {
  const categories = await getCategories();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{labels.categories.title}</h2>
      </div>
      <CategoriesClient data={categories} />
    </div>
  );
} 