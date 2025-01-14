"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { labels } from "@/config/labels";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ConfirmDelete } from "@/components/ui/confirm-delete";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: labels.products.name,
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "price",
    header: labels.products.price,
    cell: ({ row }) => formatCurrency(row.original.price),
  },
  {
    accessorKey: "quantity",
    header: labels.products.quantity,
  },
  {
    accessorKey: "status",
    header: labels.products.status,
    cell: ({ row }) => {
      const status = row.original.status as 'GOOD' | 'REASONABLE' | 'POOR' | 'DAMAGED';
      const statusColors = {
        GOOD: "text-green-600",
        REASONABLE: "text-yellow-600",
        POOR: "text-orange-600",
        DAMAGED: "text-red-600"
      };
      return (
        <span className={statusColors[status] || "text-gray-600"}>
          {labels.products.statuses[status] || status}
        </span>
      );
    },
  },
  {
    accessorKey: "category.name",
    header: labels.products.category,
  },
  {
    accessorKey: "supplier.name",
    header: labels.products.supplier,
  },
  {
    id: "actions",
    header: labels.common.actions,
    cell: ({ row, table }) => {
      const product = row.original;
      const [showDelete, setShowDelete] = useState(false);
      const onDelete = table.options.meta?.onDelete;

      return (
        <>
          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product.id}`}
              className={cn(
                "flex items-center gap-2 h-9 rounded-md px-3",
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <PencilIcon className="h-4 w-4" />
              {labels.common.edit}
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDelete(true)}
              className="text-red-600"
            >
              <TrashIcon className="h-4 w-4" />
              {labels.common.delete}
            </Button>
          </div>
          <ConfirmDelete
            isOpen={showDelete}
            onClose={() => setShowDelete(false)}
            onConfirm={() => onDelete?.(row.original.id)}
          />
        </>
      );
    },
  },
];