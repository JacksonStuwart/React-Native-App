"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground text-sm">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
