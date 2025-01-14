"use client";

import { ColumnDef } from "@tanstack/react-table";
import { labels } from "@/config/labels";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as keyof typeof labels.transactions.type;
      const label = labels.transactions.type[type];

      return (
        <Badge
          variant={type === "IN" ? "success" : type === "OUT" ? "destructive" : "default"}
        >
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <Badge
          variant={
            status === "COMPLETED"
              ? "success"
              : status === "CANCELLED"
              ? "destructive"
              : "default"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "items",
    header: "Itens",
    cell: ({ row }) => {
      const items = row.getValue("items") as any[];
      const total = items.reduce((acc, item) => acc + item.quantity, 0);

      return (
        <div className="flex flex-col">
          <span className="font-medium">{total} {labels.dashboard.items}</span>
          <span className="text-sm text-muted-foreground">
            {items.map((item) => (
              `${item.quantity}x ${item.product.name}`
            )).join(", ")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "note",
    header: "Nota",
  },
  {
    accessorKey: "user",
    header: "Usuário",
    cell: ({ row }) => (row.getValue("user") as { name: string })?.name,
  },
  {
    accessorKey: "createdAt",
    header: "Data",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "dd/MM/yyyy HH:mm"),
  },
]; 