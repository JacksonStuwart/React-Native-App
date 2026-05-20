"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Score = 0 | 1 | 2 | 3 | 4;

const LABELS = ["Too weak", "Weak", "Fair", "Strong", "Excellent"];
const COLORS = [
  "bg-destructive",
  "bg-destructive/70",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-emerald-600",
];

let initialized = false;

async function ensureInitialized() {
  if (initialized) return;
  const [{ zxcvbnOptions }, common, en] = await Promise.all([
    import("@zxcvbn-ts/core"),
    import("@zxcvbn-ts/language-common"),
    import("@zxcvbn-ts/language-en"),
  ]);
  zxcvbnOptions.setOptions({
    translations: en.translations,
    graphs: common.adjacencyGraphs,
    dictionary: { ...common.dictionary, ...en.dictionary },
  });
  initialized = true;
}

export function PasswordStrength({ password }: { password: string }) {
  const [score, setScore] = useState<Score>(0);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!password) {
        setScore(0);
        setSuggestion(null);
        return;
      }
      await ensureInitialized();
      const { zxcvbn } = await import("@zxcvbn-ts/core");
      const result = zxcvbn(password);
      if (cancelled) return;
      setScore(result.score as Score);
      setSuggestion(result.feedback.warning || result.feedback.suggestions[0] || null);
    })();
    return () => {
      cancelled = true;
    };
  }, [password]);

  const bars = useMemo(() => [0, 1, 2, 3, 4], []);

  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {bars.map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= score ? COLORS[score] : "bg-muted"
            )}
          />
        ))}
      </div>
      <div className="text-xs text-muted-foreground flex items-center justify-between">
        <span>{LABELS[score]}</span>
        {suggestion && <span className="truncate ml-2">{suggestion}</span>}
      </div>
    </div>
  );
}
