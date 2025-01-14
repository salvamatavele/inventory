"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { labels } from "@/config/labels";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: labels.suppliers.name,
  },
  {
    accessorKey: "email",
    header: labels.suppliers.email,
  },
  {
    accessorKey: "phone",
    header: labels.suppliers.phone,
  },
  {
    accessorKey: "address",
    header: labels.suppliers.address,
  },
  {
    accessorKey: "_count.products",
    header: labels.suppliers.productsCount,
  },
  {
    id: "actions",
    header: labels.common.actions,
    cell: ({ row }) => {
      const supplier = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/suppliers/${supplier.id}`}
            className={cn(
              "flex items-center gap-2 h-9 rounded-md px-3",
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <PencilIcon className="h-4 w-4" />
            {labels.common.edit}
          </Link>
          <form action={`/api/suppliers/${supplier.id}/delete`} method="POST">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4" />
              {labels.common.delete}
            </Button>
          </form>
        </div>
      );
    },
  },
]; 