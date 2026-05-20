"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CryptoTracker } from "@/components/crypto/crypto-tracker";
import { Watchlist } from "@/components/crypto/watchlist";
import { CryptoCalculator } from "@/components/crypto/crypto-calculator";
import { Portfolio } from "@/components/crypto/portfolio";

export default function CryptoPage() {
  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Crypto</h1>
        <p className="text-sm text-muted-foreground">
          Live prices via CoinGecko · refreshes every 90 seconds.
        </p>
      </div>

      <Tabs defaultValue="tracker" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tracker">Tracker</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>
        <TabsContent value="tracker">
          <CryptoTracker />
        </TabsContent>
        <TabsContent value="watchlist">
          <Watchlist />
        </TabsContent>
        <TabsContent value="portfolio">
          <Portfolio />
        </TabsContent>
        <TabsContent value="calculator">
          <CryptoCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
