"use client";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { labels } from "@/config/labels";
import { memo } from "react";
import { toast } from "react-hot-toast";

interface ProductsClientProps {
  data: any[];
}

const ProductsClient = memo(function ProductsClient({ data }: ProductsClientProps) {
  const router = useRouter();

  const onDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      router.refresh();
      toast.success(labels.products.messages.deleted);
    } catch (error) {
      toast.error(labels.products.messages.deleteError);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          onClick={() => router.push("/products/new")}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          {labels.common.add}
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="name" 
        searchPlaceholder={labels.common.search}
        noResults={labels.common.noResults}
        onDelete={onDelete}
      />
    </>
  );
});

export { ProductsClient };