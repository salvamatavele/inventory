"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { labels } from "@/config/labels";

const formSchema = z.object({
  name: z.string().min(1, labels.users.validation.nameRequired),
  email: z.string().email(labels.users.validation.emailInvalid),
  password: z.string().min(6, labels.users.validation.passwordLength).optional(),
  role: z.enum(["USER", "ADMIN"], {
    required_error: labels.users.validation.roleRequired,
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      role: (initialData?.role as "USER" | "ADMIN") || "USER",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);

      if (initialData) {
        const response = await fetch(`/api/users/${initialData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error();
        }
      } else {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error();
        }
      }

      router.refresh();
      router.push("/users");
      toast.success(
        initialData
          ? labels.users.messages.updateSuccess
          : labels.users.messages.createSuccess
      );
    } catch (error) {
      toast.error(labels.users.messages.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-6 text-gray-900"
          >
            {labels.users.name}
          </label>
          <input
            {...form.register("name")}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-6 text-gray-900"
          >
            {labels.users.email}
          </label>
          <input
            {...form.register("email")}
            type="email"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {!initialData && (
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              {labels.users.password}
            </label>
            <input
              {...form.register("password")}
              type="password"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="role"
            className="text-sm font-medium leading-6 text-gray-900"
          >
            {labels.users.role}
          </label>
          <select
            {...form.register("role")}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="USER">{labels.users.roles.user}</option>
            <option value="ADMIN">{labels.users.roles.admin}</option>
          </select>
          {form.formState.errors.role && (
            <p className="text-sm text-red-600">
              {form.formState.errors.role.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {labels.common.save}
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => router.push("/users")}
          className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {labels.common.cancel}
        </button>
      </div>
    </form>
  );
} 