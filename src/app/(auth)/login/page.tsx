"use client";

import LoginForm from "./login-form";
import { useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  if (status === "authenticated") {
    const callbackUrl = searchParams?.get("callbackUrl");
    if (callbackUrl && !callbackUrl.includes('/login')) {
      router.back();
    }
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-white bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
          Gestão de Inventário
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-400">
          Inicie sessão na sua conta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-gray-900/50 backdrop-blur-xl px-6 py-12 shadow-2xl shadow-gray-900/50 sm:rounded-xl sm:px-12 border border-gray-800">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}