"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { labels } from "@/config/labels";
import { FormField } from "@/components/ui/form-field";

const formSchema = z.object({
  name: z.string().min(1, labels.products.validation.nameRequired),
  description: z.string().optional(),
  sku: z.string().min(1, labels.products.validation.skuRequired),
  price: z.coerce.number().min(0, labels.products.validation.pricePositive),
  quantity: z.coerce.number().min(0, labels.products.validation.quantityPositive),
  minQuantity: z.coerce.number().min(0, labels.products.validation.minQuantityPositive),
  categoryId: z.string().min(1, labels.products.validation.categoryRequired),
  supplierId: z.string().min(1, labels.products.validation.supplierRequired),
  status: z.enum(["GOOD", "REASONABLE", "POOR", "DAMAGED"], {
    required_error: labels.products.validation.statusRequired,
  }),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: any | null;
  categories: Array<{ id: string; name: string }>;
  suppliers: Array<{ id: string; name: string }>;
}

export function ProductForm({
  initialData,
  categories,
  suppliers,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      sku: "",
      price: 0,
      quantity: 0,
      minQuantity: 5,
      categoryId: "",
      supplierId: "",
      status: "GOOD",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/products/${initialData.id}`
        : "/api/products";
      const response = await fetch(url, {
        method: initialData ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          price: Number(data.price),
          quantity: Number(data.quantity),
          minQuantity: Number(data.minQuantity),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Something went wrong");
      }

      router.push("/products");
      router.refresh();
      toast.success(initialData ? labels.products.messages.updated : labels.products.messages.created);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : labels.common.errors.default);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = Object.entries(labels.products.statuses).map(([value, label]) => ({
    value,
    label: label as string,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier.id,
    label: supplier.name,
  }));

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        <FormField
          label={labels.products.name}
          name="name"
          register={form.register}
          error={form.formState.errors.name?.message}
        />

        <FormField
          label="SKU"
          name="sku"
          register={form.register}
          error={form.formState.errors.sku?.message}
        />

        <FormField
          label={labels.products.price}
          name="price"
          type="number"
          step="0.01"
          register={form.register}
          error={form.formState.errors.price?.message}
        />

        <FormField
          label={labels.products.quantity}
          name="quantity"
          type="number"
          register={form.register}
          error={form.formState.errors.quantity?.message}
        />

        <FormField
          label={labels.products.minQuantity}
          name="minQuantity"
          type="number"
          register={form.register}
          error={form.formState.errors.minQuantity?.message}
        />

        <FormField
          label={labels.products.description}
          name="description"
          register={form.register}
          error={form.formState.errors.description?.message}
        />

        <FormField
          label={labels.products.category}
          name="categoryId"
          register={form.register}
          error={form.formState.errors.categoryId?.message}
          options={categoryOptions}
          placeholder={labels.products.selectCategory}
        />

        <FormField
          label={labels.products.supplier}
          name="supplierId"
          register={form.register}
          error={form.formState.errors.supplierId?.message}
          options={supplierOptions}
          placeholder={labels.products.selectSupplier}
        />

        <FormField
          label={labels.products.status}
          name="status"
          register={form.register}
          error={form.formState.errors.status?.message}
          options={statusOptions}
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          className="flex items-center gap-2"
          disabled={loading}
        >
          {loading ? labels.common.loading : labels.common.save}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/products")}
        >
          {labels.common.cancel}
        </Button>
      </div>
    </form>
  );
} 