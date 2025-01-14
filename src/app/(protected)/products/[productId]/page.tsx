import { db } from "@/lib/db";
import { ProductForm } from "./product-form";
import { notFound } from "next/navigation";
import { labels } from "@/config/labels";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

interface ProductPageProps {
  params: {
    productId: string;
  };
}

const getProduct = unstable_cache(
  async (productId: string) => {
    if (productId === "new") return null;

    return db.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        supplier: true,
      },
    });
  },
  ["product-detail"],
  {
    revalidate: 60,
    tags: ["products"],
  }
);

const getFormData = unstable_cache(
  async () => {
    const [categories, suppliers] = await Promise.all([
      db.category.findMany(),
      db.supplier.findMany(),
    ]);
    return { categories, suppliers };
  },
  ["product-form-data"],
  {
    revalidate: 60,
    tags: ["categories", "suppliers"],
  }
);

export default async function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductContent productId={params.productId} />
    </Suspense>
  );
}

function ProductLoading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{labels.products.title}</h2>
      </div>
      <div className="animate-pulse">
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function ProductContent({ productId }: { productId: string }) {
  const [product, formData] = await Promise.all([
    getProduct(productId),
    getFormData(),
  ]);

  if (productId !== "new" && !product) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {product ? labels.products.editProduct : labels.products.newProduct}
        </h2>
      </div>
      <ProductForm
        categories={formData.categories}
        suppliers={formData.suppliers}
        initialData={product}
      />
    </div>
  );
} 