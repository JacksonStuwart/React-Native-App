"use client";

import { useState } from "react";
import { RefreshCw, Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { generatePassword } from "@/lib/crypto";

export function PasswordGenerator({
  onUse,
}: {
  onUse?: (password: string) => void;
}) {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [value, setValue] = useState(() =>
    generatePassword({ length: 16, upper: true, lower: true, numbers: true, symbols: true })
  );
  const [copied, setCopied] = useState(false);

  function regen() {
    const next = generatePassword({ length, upper, lower, numbers, symbols });
    setValue(next);
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => {
        navigator.clipboard.writeText("").catch(() => {});
        setCopied(false);
      }, 30_000);
    } catch {
      toast.error("Couldn't copy");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded-md border bg-muted/40 px-3 py-2 text-sm font-mono break-all">
          {value}
        </code>
        <Button variant="outline" size="icon" onClick={regen} aria-label="Regenerate">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={copy} aria-label="Copy">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        {onUse && (
          <Button size="sm" onClick={() => onUse(value)}>
            Use
          </Button>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Length: {length}</Label>
          </div>
          <input
            type="range"
            min={8}
            max={48}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <Label>A-Z</Label>
            <Switch checked={upper} onCheckedChange={setUpper} />
          </div>
          <div className="flex items-center justify-between text-xs">
            <Label>a-z</Label>
            <Switch checked={lower} onCheckedChange={setLower} />
          </div>
          <div className="flex items-center justify-between text-xs">
            <Label>0-9</Label>
            <Switch checked={numbers} onCheckedChange={setNumbers} />
          </div>
          <div className="flex items-center justify-between text-xs">
            <Label>!@#</Label>
            <Switch checked={symbols} onCheckedChange={setSymbols} />
          </div>
        </div>
      </div>
    </div>
  );
}
