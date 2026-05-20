"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useMarkets, usePortfolio } from "@/hooks/use-crypto";
import { formatCurrency } from "@/lib/utils";

export function Portfolio() {
  const { data: coins } = useMarkets("usd");
  const { data: holdings, upsert, remove } = usePortfolio();
  const [open, setOpen] = useState(false);
  const [coinId, setCoinId] = useState("");
  const [amount, setAmount] = useState("");

  const rows = useMemo(() => {
    return holdings
      .map((h) => {
        const coin = coins?.find((c) => c.id === h.coinId);
        const price = coin?.current_price ?? 0;
        return {
          ...h,
          coin,
          value: h.amount * price,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [holdings, coins]);

  const totalValue = rows.reduce((s, r) => s + r.value, 0);

  async function save() {
    const num = Number(amount);
    if (!coinId || !num || num <= 0) {
      toast.error("Pick a coin and enter an amount");
      return;
    }
    try {
      await upsert(coinId, num);
      toast.success("Position saved");
      setOpen(false);
      setCoinId("");
      setAmount("");
    } catch {
      toast.error("Couldn't save");
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-5">
          <div className="text-sm text-muted-foreground">Total value</div>
          <div className="text-3xl font-bold tabular-nums">
            {formatCurrency(totalValue, "USD")}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Holdings</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Add position
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add position</DialogTitle>
              <DialogDescription>
                Track how much of a coin you hold; values update live with prices.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Coin</Label>
                <Select value={coinId} onValueChange={setCoinId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a coin" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {coins?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.symbol.toUpperCase()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount held</Label>
                <Input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.5"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={save}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
          Add your first position to start tracking.
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.coinId}
              className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5"
            >
              {r.coin?.image && (
                <Image
                  src={r.coin.image}
                  alt={r.coin.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                  unoptimized
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium">{r.coin?.name ?? r.coinId}</div>
                <div className="text-xs text-muted-foreground">
                  {r.amount} {r.coin?.symbol?.toUpperCase()} ·{" "}
                  {r.coin?.current_price
                    ? formatCurrency(r.coin.current_price, "USD")
                    : "—"}{" "}
                  per
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold tabular-nums">
                  {formatCurrency(r.value, "USD")}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={async () => {
                  if (confirm(`Remove ${r.coin?.name ?? r.coinId} position?`)) {
                    await remove(r.coinId);
                  }
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
