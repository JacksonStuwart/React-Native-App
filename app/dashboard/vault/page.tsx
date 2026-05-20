"use client";

import { useMemo, useState } from "react";
import { Lock, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MasterKeyPrompt } from "@/components/vault/master-key-prompt";
import { VaultForm } from "@/components/vault/vault-form";
import { VaultItem } from "@/components/vault/vault-item";
import { PasswordGenerator } from "@/components/vault/password-generator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMasterKey } from "@/hooks/use-master-key";
import { useVault } from "@/hooks/use-vault";

export default function VaultPage() {
  const { key, hasKey, setKey } = useMasterKey();
  const { data, loading } = useVault(key);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const needle = search.toLowerCase();
    return data.filter(
      (e) =>
        e.name.toLowerCase().includes(needle) ||
        e.username.toLowerCase().includes(needle) ||
        e.tags.some((t) => t.toLowerCase().includes(needle))
    );
  }, [data, search]);

  if (!hasKey) {
    return <MasterKeyPrompt />;
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vault</h1>
          <p className="text-sm text-muted-foreground">
            Your credentials, AES-encrypted client-side before saving.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setKey(null)}>
            <Lock className="h-4 w-4" />
            Lock
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                New entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New entry</DialogTitle>
                <DialogDescription>
                  Username, password, and notes are encrypted before they leave your
                  device.
                </DialogDescription>
              </DialogHeader>
              <VaultForm onDone={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries">Entries</TabsTrigger>
          <TabsTrigger value="generator">Generator</TabsTrigger>
        </TabsList>
        <TabsContent value="entries" className="space-y-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search source, username, tag…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
              {search
                ? `No entries match "${search}".`
                : "No entries yet. Add your first one above."}
            </div>
          ) : (
            <div className="grid gap-3">
              {filtered.map((entry) => (
                <VaultItem key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="generator">
          <Card>
            <CardContent className="pt-5">
              <PasswordGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
