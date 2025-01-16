"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Endereço de email inválido"),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const searchParams = new URLSearchParams(window.location.search);
      let callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      
      // Prevent redirect loops by checking if callback is login page
      if (callbackUrl.includes('/login')) {
        callbackUrl = '/dashboard';
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Credenciais inválidas");
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      toast.error("Ocorreu um erro");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-300"
        >
          Endereço de email
        </label>
        <div className="mt-2">
          <input
            {...register("email")}
            type="email"
            className="block w-full rounded-lg border-0 py-2 px-3 text-white bg-gray-800/50 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6 transition-colors"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-gray-300"
        >
          Palavra-passe
        </label>
        <div className="mt-2">
          <input
            {...register("password")}
            type="password"
            className="block w-full rounded-lg border-0 py-2 px-3 text-white bg-gray-800/50 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6 transition-colors"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "A iniciar sessão..." : "Iniciar sessão"}
        </button>
      </div>
    </form>
  );
}