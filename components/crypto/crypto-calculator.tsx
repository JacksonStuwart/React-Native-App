"use client";

import { useState, useEffect } from "react";
import { Calculator, Info, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMarkets } from "@/hooks/use-crypto";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";

const UNITS = [
  { label: "Individual", value: 1 },
  { label: "Thousand", value: 1_000 },
  { label: "Million", value: 1_000_000 },
  { label: "Billion", value: 1_000_000_000 },
] as const;

export function CryptoCalculator() {
  const { data: coins } = useMarkets("usd");
  const btc = coins?.find((c) => c.id === "bitcoin");
  const btcSupply = btc?.circulating_supply ?? 19_700_000;

  const [supply, setSupply] = useState("");
  const [unit, setUnit] = useState(1_000_000);
  const [refPrice, setRefPrice] = useState("");
  const [refCoinId, setRefCoinId] = useState("bitcoin");

  useEffect(() => {
    const ref = coins?.find((c) => c.id === refCoinId);
    if (ref) setRefPrice(ref.current_price.toString());
  }, [coins, refCoinId]);

  const totalSupply = Number(supply) * unit;
  const reference = coins?.find((c) => c.id === refCoinId);
  const refMarketCap = (reference?.current_price ?? Number(refPrice)) * btcSupply;
  const maxPrice = totalSupply > 0 ? refMarketCap / totalSupply : 0;

  function reset() {
    setSupply("");
    setUnit(1_000_000);
    if (btc) setRefPrice(btc.current_price.toString());
    setRefCoinId("bitcoin");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Calculator className="h-4 w-4" /> Max-price calculator
        </CardTitle>
        <CardDescription>
          Estimates what a coin&apos;s price would be if it reached the same market cap
          as the reference coin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Target coin&apos;s supply</Label>
            <Input
              type="number"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              placeholder="100"
              inputMode="decimal"
            />
          </div>
          <div className="space-y-2">
            <Label>Supply unit</Label>
            <Select value={String(unit)} onValueChange={(v) => setUnit(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((u) => (
                  <SelectItem key={u.value} value={String(u.value)}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Reference coin</Label>
            <Select value={refCoinId} onValueChange={setRefCoinId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {(coins ?? []).slice(0, 20).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Reference price (USD)</Label>
              {reference && (
                <button
                  type="button"
                  onClick={() => setRefPrice(reference.current_price.toString())}
                  className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Use live
                </button>
              )}
            </div>
            <Input
              type="number"
              value={refPrice}
              onChange={(e) => setRefPrice(e.target.value)}
              placeholder="0.00"
              inputMode="decimal"
            />
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5 space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Info className="h-3 w-3" /> Estimated max price
          </div>
          <div className="text-3xl font-bold tabular-nums">
            {maxPrice > 0 && isFinite(maxPrice)
              ? formatCurrency(maxPrice, "USD")
              : "—"}
          </div>
          {totalSupply > 0 && reference && (
            <div className="text-xs text-muted-foreground">
              At target supply of {formatCompactNumber(totalSupply)}, with{" "}
              {reference.name}&apos;s market cap of $
              {formatCompactNumber(refMarketCap)}.
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
