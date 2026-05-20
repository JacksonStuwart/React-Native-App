"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import type { WatchlistEntry, PortfolioEntry } from "@/lib/firestore-schema";

export type CoinMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_supply: number | null;
  max_supply: number | null;
  circulating_supply: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: { price: number[] };
};

async function fetchMarkets(vs = "usd"): Promise<CoinMarket[]> {
  const res = await fetch(`/api/crypto/markets?vs=${vs}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}

export function useMarkets(vs = "usd") {
  return useQuery({
    queryKey: ["crypto-markets", vs],
    queryFn: () => fetchMarkets(vs),
    staleTime: 60 * 1000,
    refetchInterval: 90 * 1000,
  });
}

export function useWatchlist() {
  const { user } = useAuth();
  const [data, setData] = useState<WatchlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, "users", user.uid, "watchlist"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(
          snap.docs.map((d) => ({ ...(d.data() as WatchlistEntry), coinId: d.id }))
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  async function add(coinId: string, symbol: string) {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid, "watchlist", coinId), {
      coinId,
      symbol,
      addedAt: serverTimestamp(),
    });
  }

  async function remove(coinId: string) {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "watchlist", coinId));
  }

  function isWatched(coinId: string) {
    return data.some((d) => d.coinId === coinId);
  }

  return { data, loading, add, remove, isWatched };
}

export function usePortfolio() {
  const { user } = useAuth();
  const [data, setData] = useState<PortfolioEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, "users", user.uid, "portfolio"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(
          snap.docs.map((d) => ({ ...(d.data() as PortfolioEntry), coinId: d.id }))
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  async function upsert(coinId: string, amount: number) {
    if (!user) return;
    if (amount <= 0) {
      await deleteDoc(doc(db, "users", user.uid, "portfolio", coinId));
      return;
    }
    await setDoc(doc(db, "users", user.uid, "portfolio", coinId), {
      coinId,
      amount,
      addedAt: serverTimestamp(),
    });
  }

  async function remove(coinId: string) {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "portfolio", coinId));
  }

  return { data, loading, upsert, remove };
}
