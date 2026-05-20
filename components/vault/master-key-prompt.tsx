"use client";

import { useState } from "react";
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

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
import { useAuth } from "@/hooks/use-auth";
import { useMasterKey } from "@/hooks/use-master-key";
import { verifyMasterKey } from "@/hooks/use-vault";

export function MasterKeyPrompt() {
  const { user } = useAuth();
  const { setKey } = useMasterKey();
  const [value, setValue] = useState("");
  const [confirming, setConfirming] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState<"none" | "checking" | "new">("checking");

  useState(() => {
    (async () => {
      if (!user) return;
      const { getDoc, doc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const snap = await getDoc(doc(db, "users", user.uid, "vaultMeta", "verifier"));
      setNeedsConfirm(snap.exists() ? "none" : "new");
    })();
  });

  async function submit() {
    if (!user) return;
    if (value.length < 8) {
      toast.error("Use at least 8 characters for your master key");
      return;
    }
    if (needsConfirm === "new" && value !== confirming) {
      toast.error("The two entries don't match");
      return;
    }
    setSubmitting(true);
    try {
      const result = await verifyMasterKey(user.uid, value);
      if (result === "wrong") {
        toast.error("Wrong master key");
        setValue("");
        setSubmitting(false);
        return;
      }
      setKey(value);
      toast.success(result === "new" ? "Vault initialized" : "Vault unlocked");
    } catch {
      toast.error("Couldn't verify key");
    } finally {
      setSubmitting(false);
    }
  }

  const isNew = needsConfirm === "new";

  return (
    <div className="p-6 sm:p-8 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center mb-2">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <CardTitle>{isNew ? "Set your master key" : "Unlock vault"}</CardTitle>
          <CardDescription>
            {isNew
              ? "This key encrypts your saved credentials. We can't recover it for you — write it down somewhere safe."
              : "Enter your master key to decrypt your saved credentials."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mk">Master key</Label>
            <Input
              id="mk"
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isNew) submit();
              }}
              placeholder={isNew ? "Pick a strong passphrase" : "Your master key"}
              autoFocus
            />
          </div>
          {isNew && (
            <div className="space-y-2">
              <Label htmlFor="mk2">Confirm master key</Label>
              <Input
                id="mk2"
                type="password"
                value={confirming}
                onChange={(e) => setConfirming(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                placeholder="Type it again"
              />
            </div>
          )}
          {isNew && (
            <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>
                Forgetting this key means losing access to anything you save here. There&apos;s
                no reset.
              </span>
            </div>
          )}
          <Button onClick={submit} className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isNew ? "Initialize vault" : "Unlock"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            The key is stored only for this browser session.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
