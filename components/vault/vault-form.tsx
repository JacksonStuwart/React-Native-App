"use client";

import { useState, type KeyboardEvent } from "react";
import { Eye, EyeOff, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PasswordStrength } from "@/components/vault/password-strength";
import { PasswordGenerator } from "@/components/vault/password-generator";
import { useVault, type DecryptedVaultEntry } from "@/hooks/use-vault";
import { useMasterKey } from "@/hooks/use-master-key";

export function VaultForm({
  initial,
  onDone,
}: {
  initial?: DecryptedVaultEntry;
  onDone?: () => void;
}) {
  const { key } = useMasterKey();
  const { add, update } = useVault(key);

  const [name, setName] = useState(initial?.name ?? "");
  const [username, setUsername] = useState(initial?.username ?? "");
  const [password, setPassword] = useState(initial?.password ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [show, setShow] = useState(false);
  const [showGen, setShowGen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function addTag() {
    const v = tagInput.trim();
    if (!v) return;
    if (!tags.includes(v) && tags.length < 5) {
      setTags([...tags, v]);
    }
    setTagInput("");
  }

  function onTagKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags(tags.slice(0, -1));
    }
  }

  async function submit() {
    if (!name.trim() || !username.trim() || !password) {
      toast.error("Source, username, and password are required");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        username,
        password,
        url: url || null,
        notes: notes || null,
        tags,
      };
      if (initial) {
        await update(initial.id, payload);
        toast.success("Entry updated");
      } else {
        await add(payload);
        toast.success("Entry saved");
      }
      onDone?.();
    } catch {
      toast.error("Couldn't save entry");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="v-name">Source</Label>
        <Input
          id="v-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. GitHub"
          autoFocus={!initial}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="v-user">Username or email</Label>
        <Input
          id="v-user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="you@example.com"
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="v-pass">Password</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowGen((v) => !v)}
            className="h-7 text-xs"
          >
            <Sparkles className="h-3 w-3" />
            {showGen ? "Hide" : "Generate"}
          </Button>
        </div>
        <div className="relative">
          <Input
            id="v-pass"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="off"
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-7 w-7"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide" : "Show"}
          >
            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
        </div>
        <PasswordStrength password={password} />
        {showGen && (
          <div className="rounded-md border bg-muted/30 p-3">
            <PasswordGenerator onUse={(p) => setPassword(p)} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="v-url">URL (optional)</Label>
        <Input
          id="v-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com"
          type="url"
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <Label>Tags (optional)</Label>
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((t) => (
            <Badge key={t} variant="secondary" className="gap-1">
              {t}
              <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {tags.length < 5 && (
            <Input
              placeholder="e.g. work"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKey}
              onBlur={addTag}
              className="h-7 w-32 text-xs"
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="v-notes">Notes (optional, encrypted)</Label>
        <Textarea
          id="v-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Recovery codes, security questions, etc."
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onDone && (
          <Button variant="ghost" onClick={onDone}>
            Cancel
          </Button>
        )}
        <Button onClick={submit} disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {initial ? "Save changes" : "Add entry"}
        </Button>
      </div>
    </div>
  );
}
