"use client";

import { useMemo } from "react";
import { CryptoTable } from "@/components/crypto/crypto-table";
import { useMarkets, useWatchlist } from "@/hooks/use-crypto";

export function Watchlist() {
  const { data: watched, loading: wlLoading } = useWatchlist();
  const { data: coins, isLoading: cLoading } = useMarkets("usd");

  const watchedCoins = useMemo(() => {
    if (!coins) return [];
    const ids = new Set(watched.map((w) => w.coinId));
    return coins.filter((c) => ids.has(c.id));
  }, [coins, watched]);

  return (
    <CryptoTable
      coins={watchedCoins}
      loading={wlLoading || cLoading}
      emptyMessage="Star coins in the Tracker to add them here."
    />
  );
}
