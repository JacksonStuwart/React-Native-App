"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">
              A
            </div>
            <span className="font-semibold tracking-tight">Atlas</span>
          </Link>
        </div>
      </header>
      <div className="flex-1 grid place-items-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </main>
  );
}
