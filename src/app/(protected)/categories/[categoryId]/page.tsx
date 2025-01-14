import { db } from "@/lib/db";
import { CategoryForm } from "./category-form";
import { notFound } from "next/navigation";
import { labels } from "@/config/labels";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

const getCategory = unstable_cache(
  async (categoryId: string) => {
    if (categoryId === "new") return null;

    return db.category.findUnique({
      where: {
        id: categoryId,
      },
    });
  },
  ["category-detail"],
  {
    revalidate: 60,
    tags: ["categories"],
  }
);

export default async function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryContent categoryId={params.categoryId} />
    </Suspense>
  );
}

function CategoryLoading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{labels.categories.title}</h2>
      </div>
      <div className="animate-pulse">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function CategoryContent({ categoryId }: { categoryId: string }) {
  const category = await getCategory(categoryId);

  if (categoryId !== "new" && !category) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {category ? labels.categories.editCategory : labels.categories.newCategory}
        </h2>
      </div>
      <CategoryForm initialData={category} />
    </div>
  );
} 