"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { labels } from "@/config/labels";

const formSchema = z.object({
  name: z.string().min(1, labels.suppliers.validation.nameRequired),
  email: z.string().email(labels.suppliers.validation.emailInvalid),
  phone: z.string().min(1, labels.suppliers.validation.phoneRequired),
  address: z.string().min(1, labels.suppliers.validation.addressRequired),
});

type SupplierFormValues = z.infer<typeof formSchema>;

interface SupplierFormProps {
  initialData: any | null;
}

export function SupplierForm({ initialData }: SupplierFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: SupplierFormValues) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/suppliers/${initialData.id}`
        : "/api/suppliers";
      const response = await fetch(url, {
        method: initialData ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      router.push("/suppliers");
      router.refresh();
      toast.success(initialData ? labels.suppliers.updated : labels.suppliers.created);
    } catch (error) {
      toast.error(labels.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {labels.suppliers.name}
          </label>
          <Input {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {labels.suppliers.email}
          </label>
          <Input type="email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {labels.suppliers.phone}
          </label>
          <Input {...form.register("phone")} />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-500">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="address"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {labels.suppliers.address}
          </label>
          <Input {...form.register("address")} />
          {form.formState.errors.address && (
            <p className="text-sm text-red-500">
              {form.formState.errors.address.message}
            </p>
          )}
        </div>
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
          onClick={() => router.push("/suppliers")}
        >
          {labels.common.cancel}
        </Button>
      </div>
    </form>
  );
} 