"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard]", error);
  }, [error]);

  return (
    <div className="p-6 sm:p-8 max-w-md mx-auto">
      <Card>
        <CardContent className="py-10 text-center space-y-4">
          <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive grid place-items-center mx-auto">
            <AlertCircle className="h-5 w-5" />
          </div>
          <h2 className="font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            {error.message || "An unexpected error happened on this page."}
          </p>
          <div className="flex justify-center gap-2">
            <Button onClick={reset}>Try again</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
