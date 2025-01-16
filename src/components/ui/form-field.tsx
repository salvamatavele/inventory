"use client";

import { Input } from "@/components/ui/input";
import { HTMLInputTypeAttribute } from "react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: HTMLInputTypeAttribute;
  step?: string;
  error?: string;
  register: any;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  step,
  error,
  register,
  options,
  placeholder,
}: FormFieldProps) {
  const baseInputClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      {options ? (
        <select
          {...register(name)}
          className={baseInputClasses}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          type={type}
          step={step}
          {...register(name)}
        />
      )}
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
} 