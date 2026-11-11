"use strict";
(() => {
const IDLE_LOCK_MS = 5 * 60 * 1000;
const CLIP_CLEAR_MS = 30 * 1000;

// ---- CryptoJS-compatible AES decrypt (passphrase mode: "Salted__" + salt, EVP_BytesToKey/MD5, AES-256-CBC) ----
const K = new Int32Array(64);
for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
const R = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
function md5(bytes) {
  const len = bytes.length, n = ((len + 8) >>> 6) + 1, w = new Int32Array(n * 16);
  for (let i = 0; i < len; i++) w[i >> 2] |= bytes[i] << ((i % 4) * 8);
  w[len >> 2] |= 0x80 << ((len % 4) * 8);
  w[n * 16 - 2] = len * 8;
  let a0 = 0x67452301, b0 = 0xefcdab89 | 0, c0 = 0x98badcfe | 0, d0 = 0x10325476;
  for (let o = 0; o < n * 16; o += 16) {
    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) { f = (b & c) | (~b & d); g = i; }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; }
      f = (f + a + K[i] + w[o + g]) | 0;
      a = d; d = c; c = b;
      b = (b + ((f << R[i]) | (f >>> (32 - R[i])))) | 0;
    }
    a0 = (a0 + a) | 0; b0 = (b0 + b) | 0; c0 = (c0 + c) | 0; d0 = (d0 + d) | 0;
  }
  const out = new Uint8Array(16), dv = new DataView(out.buffer);
  [a0, b0, c0, d0].forEach((v, i) => dv.setInt32(i * 4, v, true));
  return out;
}
function concat(...parts) {
  const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
  let off = 0;
  for (const p of parts) { out.set(p, off); off += p.length; }
  return out;
}
const enc = new TextEncoder();
const strictUtf8 = new TextDecoder("utf-8", { fatal: true });
async function decrypt(b64, pass) {
  try {
    if (typeof b64 !== "string" || !b64) return "";
    const raw = Uint8Array.from(atob(b64.trim()), (ch) => ch.charCodeAt(0));
    if (raw.length < 32 || String.fromCharCode(...raw.subarray(0, 8)) !== "Salted__") return "";
    const salt = raw.subarray(8, 16), ct = raw.subarray(16), pw = enc.encode(pass);
    let derived = new Uint8Array(0), block = new Uint8Array(0);
    while (derived.length < 48) { block = md5(concat(block, pw, salt)); derived = concat(derived, block); }
    const key = await crypto.subtle.importKey("raw", derived.subarray(0, 32), "AES-CBC", false, ["decrypt"]);
    const plain = await crypto.subtle.decrypt({ name: "AES-CBC", iv: derived.subarray(32, 48) }, key, ct);
    return strictUtf8.decode(plain);
  } catch {
    return ""; // wrong key -> bad padding or invalid UTF-8; or not valid ciphertext
  }
}

// ---- find { name: { userId, password } } records anywhere in a JSON export ----
// Accepts a full Realtime Database export, a single user node, the "keys" node itself,
// or a plain { "Site": { "userId": "...", "password": "..." } } object.
function findEntries(data) {
  const found = [];
  const seen = new Set();
  (function walk(node, depth) {
    if (!node || typeof node !== "object" || depth > 8) return;
    for (const [name, val] of Object.entries(node)) {
      if (val && typeof val === "object" && (typeof val.password === "string" || typeof val.userId === "string")) {
        const id = name + "\u0000" + val.userId + "\u0000" + val.password;
        if (!seen.has(id)) { seen.add(id); found.push({ name, userId: val.userId || "", password: val.password || "" }); }
      } else {
        walk(val, depth + 1);
      }
    }
  })(data, 0);
  return found;
}

// ---- DOM helpers (data is only ever inserted as text, never as HTML) ----
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "class") el.className = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c instanceof Node ? c : String(c));
  return el;
}
const PATHS = {
  shield: ["M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"],
  eye: ["M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  eyeOff: ["M3 3l18 18", "M10.6 10.6a2 2 0 0 0 2.8 2.8", "M9.9 5.1A10.4 10.4 0 0 1 12 5c7 0 11 7 11 7a18 18 0 0 1-3.2 4.1", "M6.6 6.6A18 18 0 0 0 1 12s4 7 11 7a10 10 0 0 0 5.4-1.6"],
  copy: ["M9 9h11v11H9z", "M5 15H4V4h11v1"],
  check: ["M5 12l5 5L20 7"],
  lock: ["M5 11h14v10H5z", "M8 11V7a4 4 0 0 1 8 0v4"],
  search: ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "M21 21l-5-5"],
  file: ["M14 3H6v18h12V7z", "M14 3v4h4"],
};
function icon(name) {
  const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "icon");
  svg.setAttribute("aria-hidden", "true");
  for (const d of PATHS[name]) { const p = document.createElementNS(ns, "path"); p.setAttribute("d", d); svg.append(p); }
  return svg;
}
const root = document.getElementById("app");
function render(view) {
  root.replaceChildren(view);
  const f = root.querySelector("[data-autofocus]");
  if (f) f.focus();
}
function toast(msg, kind) {
  const t = h("div", { class: `toast ${kind || ""}`, role: "status" }, msg);
  document.body.append(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 2800);
}
const brand = () => h("div", { class: "brand" }, h("div", { class: "logo" }, icon("shield")), h("span", null, "Vault"));
const foot = () => h("p", { class: "foot" }, "Works offline · decrypted only in this tab · auto-locks after 5 minutes idle");

// ---- state (memory only; nothing is ever saved) ----
let cipherEntries = null; // [{ name, userId, password }] still encrypted
let sourceLabel = "";
let entries = null; // decrypted
let idleTimer = null;

// Optional: paste a JSON export between the tags of <script type="application/json" id="vault-data">
// in this file to skip choosing a file each time.
try {
  const embedded = document.getElementById("vault-data");
  const parsed = embedded && embedded.textContent.trim() ? JSON.parse(embedded.textContent) : null;
  const list = parsed ? findEntries(parsed) : [];
  if (list.length) { cipherEntries = list; sourceLabel = "built into this page"; }
} catch { /* ignore a malformed embedded block; the file picker still works */ }

function unlockView(notice) {
  const key = h("input", { type: "password", id: "mkey", autocomplete: "off", spellcheck: "false", placeholder: "Master key", "data-autofocus": true });
  const err = h("p", { class: "error", role: "alert" }, notice || "");
  const btn = h("button", { type: "submit", class: "primary" }, "Unlock");
  const fileInput = h("input", { type: "file", id: "vfile", accept: ".json,application/json", class: "visually-hidden" });
  const fileName = h("span", { class: "file-name" }, cipherEntries ? `${cipherEntries.length} saved entries · ${sourceLabel}` : "No file chosen");
  const drop = h("label", { for: "vfile", class: `drop${cipherEntries ? " ready" : ""}` },
    icon("file"),
    h("span", { class: "drop-text" },
      h("strong", null, cipherEntries ? "Vault file loaded" : "Choose your vault file"),
      fileName));

  async function loadFile(file) {
    err.textContent = "";
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("That file is too large to be a vault export.");
      const list = findEntries(JSON.parse(await file.text()));
      if (!list.length) throw new Error("No saved passwords found in that file.");
      cipherEntries = list;
      sourceLabel = file.name;
      fileName.textContent = `${list.length} saved entries · ${file.name}`;
      drop.querySelector("strong").textContent = "Vault file loaded";
      drop.classList.add("ready");
      key.focus();
    } catch (e) {
      err.textContent = e instanceof SyntaxError ? "That file isn't valid JSON." : e.message;
    }
  }
  fileInput.addEventListener("change", () => fileInput.files[0] && loadFile(fileInput.files[0]));
  for (const ev of ["dragenter", "dragover"]) drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); });
  for (const ev of ["dragleave", "drop"]) drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); });
  drop.addEventListener("drop", (e) => e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]));

  async function submit(e) {
    e.preventDefault();
    err.textContent = "";
    if (!cipherEntries) { err.textContent = "Choose your vault file first."; return; }
    if (!key.value) { key.focus(); return; }
    btn.disabled = true; btn.textContent = "Unlocking…";
    try {
      const out = await Promise.all(cipherEntries.map(async (c) => {
        const userId = await decrypt(c.userId, key.value);
        const password = await decrypt(c.password, key.value);
        return { name: c.name, userId, password, ok: !!(userId || password) };
      }));
      out.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
      if (!out.some((x) => x.ok)) { err.textContent = "Wrong master key — nothing could be decrypted."; key.select(); return; }
      key.value = "";
      entries = out;
      armIdle();
      render(vaultView());
    } finally {
      btn.disabled = false; btn.textContent = "Unlock";
    }
  }

  return h("main", { class: "shell" }, brand(),
    h("form", { class: "card", onsubmit: submit },
      h("h1", null, "Unlock vault"),
      h("p", { class: "muted" }, "Enter your master key to decrypt your saved passwords. Nothing leaves this page."),
      cipherEntries && sourceLabel === "built into this page" ? null : [fileInput, drop],
      h("label", { for: "mkey" }, "Master key"), key,
      err, btn),
    foot());
}

function copyBtn(value, label) {
  const b = h("button", { type: "button", class: "icon-btn", title: `Copy ${label}`, "aria-label": `Copy ${label}` }, icon("copy"));
  b.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(value);
      b.replaceChildren(icon("check"));
      toast(`${label} copied · clears in 30s`, "ok");
      setTimeout(() => b.replaceChildren(icon("copy")), 1500);
      setTimeout(() => navigator.clipboard.writeText("").catch(() => {}), CLIP_CLEAR_MS);
    } catch { toast("Couldn't copy to clipboard", "bad"); }
  });
  return b;
}

function entryCard(e) {
  const avatar = h("div", { class: "avatar" }, e.name.slice(0, 2).toUpperCase());
  if (!e.ok) {
    return h("article", { class: "entry dim", "data-q": e.name.toLowerCase() }, avatar,
      h("div", { class: "body" }, h("div", { class: "name" }, e.name),
        h("p", { class: "muted small" }, "Can't decrypt this one with this key.")));
  }
  let shown = false;
  const MASK = "••••••••••";
  const pw = h("span", { class: "mono secret" }, MASK);
  const eye = h("button", { type: "button", class: "icon-btn", title: "Show", "aria-label": "Show password" }, icon("eye"));
  eye.addEventListener("click", () => {
    shown = !shown;
    pw.textContent = shown ? e.password : MASK;
    pw.classList.toggle("secret", !shown);
    eye.replaceChildren(icon(shown ? "eyeOff" : "eye"));
    eye.setAttribute("aria-label", shown ? "Hide password" : "Show password");
  });
  return h("article", { class: "entry", "data-q": `${e.name} ${e.userId}`.toLowerCase() }, avatar,
    h("div", { class: "body" },
      h("div", { class: "name" }, e.name),
      h("div", { class: "row" }, h("span", { class: "label" }, "User ID"), h("span", { class: "mono" }, e.userId || "—"), e.userId ? copyBtn(e.userId, "User ID") : null),
      h("div", { class: "row" }, h("span", { class: "label" }, "Password"), pw, eye, e.password ? copyBtn(e.password, "Password") : null)));
}

function vaultView() {
  const okCount = entries.filter((e) => e.ok).length;
  const list = h("div", { class: "list" }, entries.map(entryCard));
  const none = h("p", { class: "muted center", hidden: true }, "No matches.");
  const search = h("input", { type: "search", class: "search", placeholder: "Search by site or user ID", "aria-label": "Search", "data-autofocus": true });
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    let n = 0;
    for (const el of list.children) { const hit = !q || el.dataset.q.includes(q); el.hidden = !hit; if (hit) n++; }
    none.hidden = n > 0;
  });
  return h("main", { class: "shell wide" },
    h("header", { class: "topbar" }, brand(),
      h("button", { type: "button", class: "ghost", onclick: lock }, icon("lock"), "Lock")),
    h("div", { class: "summary" }, h("h1", null, "Saved passwords"), h("span", { class: "pill" }, `${okCount} of ${entries.length} unlocked`)),
    h("div", { class: "search-wrap" }, icon("search"), search),
    list, none, foot());
}

function lock(notice) {
  entries = null;
  clearTimeout(idleTimer);
  render(unlockView(typeof notice === "string" ? notice : ""));
}
function armIdle() {
  clearTimeout(idleTimer);
  if (entries) idleTimer = setTimeout(() => lock("Locked after 5 minutes of inactivity."), IDLE_LOCK_MS);
}
for (const ev of ["pointerdown", "keydown", "scroll", "touchstart"]) addEventListener(ev, armIdle, { passive: true });
document.addEventListener("visibilitychange", () => { if (document.hidden && entries) { idleTimer && clearTimeout(idleTimer); idleTimer = setTimeout(() => lock("Locked while the tab was hidden."), 60 * 1000); } });

render(unlockView());
})();
