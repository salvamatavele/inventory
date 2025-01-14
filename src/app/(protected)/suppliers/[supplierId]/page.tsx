import { db } from "@/lib/db";
import { SupplierForm } from "./supplier-form";
import { notFound } from "next/navigation";
import { labels } from "@/config/labels";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

interface SupplierPageProps {
  params: {
    supplierId: string;
  };
}

const getSupplier = unstable_cache(
  async (supplierId: string) => {
    if (supplierId === "new") return null;

    return db.supplier.findUnique({
      where: {
        id: supplierId,
      },
    });
  },
  ["supplier-detail"],
  {
    revalidate: 60,
    tags: ["suppliers"],
  }
);

export default function SupplierPage({ params }: SupplierPageProps) {
  return (
    <Suspense fallback={<SupplierLoading />}>
      <SupplierContent params={params} />
    </Suspense>
  );
}

function SupplierLoading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{labels.suppliers.title}</h2>
      </div>
      <div className="animate-pulse">
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function SupplierContent({ params }: { params: { supplierId: string } }) {
  const supplier = await getSupplier(params.supplierId);

  if (params.supplierId !== "new" && !supplier) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {supplier ? labels.suppliers.editSupplier : labels.suppliers.newSupplier}
        </h2>
      </div>
      <SupplierForm initialData={supplier} />
    </div>
  );
} 