"use client";

import { ColumnDef, TableMeta } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { labels } from "@/config/labels";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ConfirmDelete } from "@/components/ui/confirm-delete";
import { useState } from "react";

interface TableCustomMeta extends TableMeta<any> {
  onDelete: (id: string) => void;
}

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: labels.users.name,
  },
  {
    accessorKey: "email",
    header: labels.users.email,
  },
  {
    accessorKey: "role",
    header: labels.users.role,
    cell: ({ row }) => {
      const role = row.original.role as 'ADMIN' | 'MANAGER' | 'USER';
      return labels.users.roles[role.toLowerCase() as keyof typeof labels.users.roles];
    },
  },
  {
    accessorKey: "createdAt",
    header: labels.users.createdAt,
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "PPp", { locale: ptBR });
    },
  },
  {
    id: "actions",
    header: labels.common.actions,
    cell: ({ row, table }) => {
      const user = row.original;
        const [showDelete, setShowDelete] = useState(false);
            const onDelete = (table.options.meta as TableCustomMeta)?.onDelete;
      

      return (
        <>
        <div className="flex items-center gap-2">
          <Link
            href={`/users/${user.id}`}
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
                      onConfirm={async () => {
                        return Promise.resolve(onDelete?.(row.original.id));
                      }}
                    />
        </>
      );
    },
  },
]; 