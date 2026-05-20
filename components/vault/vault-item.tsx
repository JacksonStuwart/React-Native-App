"use client";

import { useState } from "react";
import {
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VaultForm } from "@/components/vault/vault-form";
import { useVault, type DecryptedVaultEntry } from "@/hooks/use-vault";
import { useMasterKey } from "@/hooks/use-master-key";

export function VaultItem({ entry }: { entry: DecryptedVaultEntry }) {
  const { key } = useMasterKey();
  const { remove } = useVault(key);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`, {
        description: "Clipboard will clear in 30 seconds.",
      });
      setTimeout(() => {
        navigator.clipboard.writeText("").catch(() => {});
      }, 30_000);
    } catch {
      toast.error("Couldn't copy");
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${entry.name}"?`)) return;
    try {
      await remove(entry.id);
      toast.success("Entry deleted");
    } catch {
      toast.error("Couldn't delete");
    }
  }

  const initials = entry.name.slice(0, 2).toUpperCase();
  const isCorrupt =
    !entry.username && !entry.password && !entry.notes && entry.name;

  return (
    <>
      <div className="group rounded-lg border bg-card p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center font-semibold text-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-medium truncate">{entry.name}</div>
              {entry.tags.map((t) => (
                <Badge key={t} variant="outline" className="text-[10px] h-4">
                  {t}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {isCorrupt ? "Can't decrypt with this key" : entry.username}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                aria-label="More"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {entry.url && (
                <DropdownMenuItem asChild>
                  <a href={entry.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" /> Open URL
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setEditing(true)}>
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {!isCorrupt && (
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-1.5">
              <span className="text-xs text-muted-foreground">Username</span>
              <span className="font-mono text-xs truncate flex-1 text-right">
                {entry.username}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => copy(entry.username, "Username")}
                aria-label="Copy username"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-1.5">
              <span className="text-xs text-muted-foreground">Password</span>
              <span className="font-mono text-xs truncate flex-1 text-right">
                {show ? entry.password : "•".repeat(Math.min(entry.password.length, 14))}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide" : "Show"}
              >
                {show ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => copy(entry.password, "Password")}
                aria-label="Copy password"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            {entry.notes && (
              <div className="rounded-md bg-muted/40 px-3 py-1.5 text-xs">
                <div className="text-muted-foreground mb-1">Notes</div>
                <div className="whitespace-pre-wrap">{entry.notes}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit entry</DialogTitle>
          </DialogHeader>
          <VaultForm initial={entry} onDone={() => setEditing(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
