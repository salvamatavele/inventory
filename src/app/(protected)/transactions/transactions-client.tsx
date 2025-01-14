"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { labels } from "@/config/labels";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormField } from "@/components/ui/form-field";

const formSchema = z.object({
  type: z.enum(["STOCK_IN", "STOCK_OUT", "ADJUSTMENT"]),
  note: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().min(1),
    price: z.number(),
  })).min(1),
});

type TransactionFormValues = z.infer<typeof formSchema>;

interface TransactionsClientProps {
  data: any[];
  products: any[];
}

export function TransactionsClient({ data, products }: TransactionsClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([{ productId: "", quantity: 1, price: 0 }]);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "STOCK_IN",
      note: "",
      items: [{ productId: "", quantity: 1, price: 0 }],
    },
  });

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      setLoading(true);
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Something went wrong");
      }

      router.refresh();
      setOpen(false);
      toast.success(labels.transactions.messages.created);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : labels.common.errors.default);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const typeOptions = [
    { value: "STOCK_IN", label: labels.transactions.type.IN },
    { value: "STOCK_OUT", label: labels.transactions.type.OUT },
    { value: "ADJUSTMENT", label: "Ajuste" },
  ];

  const productOptions = products.map((product) => ({
    value: product.id,
    label: `${product.name} (${product.quantity} em stock)`,
  }));

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpen(true)}>
          {labels.common.add}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="note"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <FormField
                label="Tipo"
                name="type"
                register={form.register}
                error={form.formState.errors.type?.message}
                options={typeOptions}
              />

              <FormField
                label="Nota"
                name="note"
                register={form.register}
                error={form.formState.errors.note?.message}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Itens</h3>
                <Button type="button" variant="outline" onClick={addItem}>
                  Adicionar Item
                </Button>
              </div>

              {items.map((_, index) => (
                <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-3 p-4 border rounded-lg">
                  <FormField
                    label="Produto"
                    name={`items.${index}.productId`}
                    register={form.register}
                    error={form.formState.errors.items?.[index]?.productId?.message}
                    options={productOptions}
                  />

                  <FormField
                    label="Quantidade"
                    name={`items.${index}.quantity`}
                    type="number"
                    register={form.register}
                    error={form.formState.errors.items?.[index]?.quantity?.message}
                  />

                  <FormField
                    label="Preço"
                    name={`items.${index}.price`}
                    type="number"
                    register={form.register}
                    error={form.formState.errors.items?.[index]?.price?.message}
                  />

                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeItem(index)}
                      className="mt-2"
                    >
                      Remover
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? labels.common.loading : labels.common.save}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {labels.common.cancel}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 