"use client";

import { useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CryptoTable } from "@/components/crypto/crypto-table";
import { useMarkets } from "@/hooks/use-crypto";

export function CryptoTracker() {
  const { data: coins, isLoading, isFetching, refetch, error } = useMarkets("usd");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!coins) return [];
    if (!search.trim()) return coins;
    const needle = search.toLowerCase();
    return coins.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.symbol.toLowerCase().includes(needle)
    );
  }, [coins, search]);

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
        Couldn&apos;t load market data. CoinGecko may be rate-limited; try again in a minute.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search Bitcoin, Ethereum…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={isFetching ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
          Refresh
        </Button>
      </div>
      <CryptoTable
        coins={filtered}
        loading={isLoading}
        emptyMessage={search ? `No coins match "${search}"` : "No data."}
      />
    </div>
  );
}
