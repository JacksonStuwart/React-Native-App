"use client";

import Image from "next/image";
import { Star, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkline } from "@/components/crypto/sparkline";
import { useWatchlist, type CoinMarket } from "@/hooks/use-crypto";
import { cn, formatCompactNumber, formatCurrency } from "@/lib/utils";

export function CryptoTable({
  coins,
  loading,
  emptyMessage = "No coins to show.",
}: {
  coins: CoinMarket[];
  loading?: boolean;
  emptyMessage?: string;
}) {
  const { add, remove, isWatched } = useWatchlist();

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!coins.length) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  async function toggleWatch(coin: CoinMarket) {
    try {
      if (isWatched(coin.id)) {
        await remove(coin.id);
        toast.success(`Removed ${coin.symbol.toUpperCase()}`);
      } else {
        await add(coin.id, coin.symbol);
        toast.success(`Added ${coin.symbol.toUpperCase()} to watchlist`);
      }
    } catch {
      toast.error("Couldn't update watchlist");
    }
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40">
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="py-2 pl-3 w-10"></th>
            <th className="py-2 pr-3">#</th>
            <th className="py-2 pr-3">Coin</th>
            <th className="py-2 pr-3 text-right">Price</th>
            <th className="py-2 pr-3 text-right">24h</th>
            <th className="py-2 pr-3 text-right hidden md:table-cell">Market cap</th>
            <th className="py-2 pr-3 hidden lg:table-cell">7d</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((c) => {
            const positive = (c.price_change_percentage_24h ?? 0) >= 0;
            const watched = isWatched(c.id);
            return (
              <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="py-2 pl-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => toggleWatch(c)}
                    aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
                  >
                    <Star
                      className={cn(
                        "h-3.5 w-3.5",
                        watched ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                      )}
                    />
                  </Button>
                </td>
                <td className="py-2 pr-3 text-muted-foreground tabular-nums">
                  {c.market_cap_rank}
                </td>
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src={c.image}
                      alt={c.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                      unoptimized
                    />
                    <div>
                      <div className="font-medium leading-tight">{c.name}</div>
                      <div className="text-[11px] text-muted-foreground uppercase">
                        {c.symbol}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-2 pr-3 text-right tabular-nums font-medium">
                  {formatCurrency(c.current_price, "USD")}
                </td>
                <td className="py-2 pr-3 text-right tabular-nums">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-xs",
                      positive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-destructive"
                    )}
                  >
                    {positive ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {Math.abs(c.price_change_percentage_24h ?? 0).toFixed(2)}%
                  </span>
                </td>
                <td className="py-2 pr-3 text-right tabular-nums text-muted-foreground hidden md:table-cell">
                  ${formatCompactNumber(c.market_cap)}
                </td>
                <td className="py-2 pr-3 hidden lg:table-cell w-32">
                  {c.sparkline_in_7d?.price && (
                    <Sparkline
                      data={c.sparkline_in_7d.price}
                      color={positive ? "#10b981" : "#ef4444"}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
