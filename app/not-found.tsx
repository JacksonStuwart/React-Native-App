import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-7xl font-bold text-primary">404</div>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you were looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </main>
  );
}
