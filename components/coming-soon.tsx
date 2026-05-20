import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <Card>
        <CardContent className="py-16 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
