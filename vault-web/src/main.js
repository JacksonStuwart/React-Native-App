"use strict";
(() => {
const API_KEY = "AIzaSyCt1NyQFEJkrIC3td6Tt0Kbn5KY6h1OMjU"; // public project identifier, not a secret
const DB = "https://homeallowance-ff1fa-default-rtdb.firebaseio.com";
const AUTH = "https://identitytoolkit.googleapis.com/v1/accounts:";
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
    const raw = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
    if (raw.length < 32 || String.fromCharCode(...raw.subarray(0, 8)) !== "Salted__") return "";
    const salt = raw.subarray(8, 16), ct = raw.subarray(16), pw = enc.encode(pass);
    let derived = new Uint8Array(0), block = new Uint8Array(0);
    while (derived.length < 48) { block = md5(concat(block, pw, salt)); derived = concat(derived, block); }
    const key = await crypto.subtle.importKey("raw", derived.subarray(0, 32), "AES-CBC", false, ["decrypt"]);
    const plain = await crypto.subtle.decrypt({ name: "AES-CBC", iv: derived.subarray(32, 48) }, key, ct);
    return strictUtf8.decode(plain);
  } catch {
    return ""; // wrong key -> bad padding or invalid UTF-8
  }
}

// ---- Firebase REST (token kept in memory only; reload = sign in again) ----
let session = null; // { uid, idToken, expiresAt }
async function authCall(method, body) {
  const res = await fetch(`${AUTH}${method}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data.error && data.error.message) || `HTTP ${res.status}`);
  return data;
}
async function dbGet(path) {
  if (!session || Date.now() > session.expiresAt) throw new Error("SESSION_EXPIRED");
  const res = await fetch(`${DB}/${path}.json?auth=${encodeURIComponent(session.idToken)}`);
  if (res.status === 401) throw new Error("PERMISSION_DENIED");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
function friendly(err) {
  const m = String((err && err.message) || err);
  if (/INVALID_LOGIN_CREDENTIALS|INVALID_PASSWORD|INVALID_CREDENTIAL/.test(m)) return "Wrong email or password.";
  if (/EMAIL_NOT_FOUND/.test(m)) return "No account with that email.";
  if (/INVALID_EMAIL/.test(m)) return "That email doesn't look right.";
  if (/TOO_MANY_ATTEMPTS/.test(m)) return "Too many attempts. Wait a bit and try again.";
  if (/USER_DISABLED/.test(m)) return "This account has been disabled.";
  if (/SESSION_EXPIRED/.test(m)) return "Your session expired. Please sign in again.";
  if (/PERMISSION_DENIED/.test(m)) return "The database refused access for this account.";
  if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return "Network error. Check your connection.";
  return m;
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
const foot = () => h("p", { class: "foot" }, "Decrypted only in this tab · auto-locks after 5 minutes idle");
const shell = (...kids) => h("main", { class: "shell" }, brand(), ...kids, foot());

// ---- state (memory only) ----
let cipher = null, entries = null, displayName = "", idleTimer = null;

function signInView(notice) {
  const email = h("input", { type: "email", id: "email", autocomplete: "username", required: true, placeholder: "you@example.com", "data-autofocus": true });
  const pass = h("input", { type: "password", id: "password", autocomplete: "current-password", required: true, placeholder: "Your account password" });
  const err = h("p", { class: "error", role: "alert" }, notice || "");
  const btn = h("button", { type: "submit", class: "primary" }, "Sign in");
  async function submit(e) {
    e.preventDefault();
    err.textContent = "";
    btn.disabled = true; btn.textContent = "Signing in…";
    try {
      const r = await authCall("signInWithPassword", { email: email.value.trim(), password: pass.value, returnSecureToken: true });
      pass.value = "";
      session = { uid: r.localId, idToken: r.idToken, expiresAt: Date.now() + (Number(r.expiresIn) || 3600) * 1000 - 60000 };
      render(unlockView());
      dbGet(`Users/${encodeURIComponent(session.uid)}/UserName`).then((n) => {
        if (typeof n === "string" && n.trim() && !entries) { displayName = n.trim(); render(unlockView()); }
      }).catch(() => {});
    } catch (e2) {
      err.textContent = friendly(e2);
      btn.disabled = false; btn.textContent = "Sign in";
    }
  }
  async function forgot() {
    err.textContent = "";
    if (!email.value.trim()) { err.textContent = "Type your email first, then click “Forgot password?”."; email.focus(); return; }
    try { await authCall("sendOobCode", { requestType: "PASSWORD_RESET", email: email.value.trim() }); toast("Password reset email sent.", "ok"); }
    catch (e2) { err.textContent = friendly(e2); }
  }
  return shell(h("form", { class: "card", onsubmit: submit },
    h("h1", null, "Sign in"),
    h("p", { class: "muted" }, "Use the account from your Home Allowance app."),
    h("label", { for: "email" }, "Email"), email,
    h("label", { for: "password" }, "Password"), pass,
    err, btn,
    h("button", { type: "button", class: "link", onclick: forgot }, "Forgot password?")));
}

function unlockView() {
  const key = h("input", { type: "password", id: "mkey", autocomplete: "off", spellcheck: "false", placeholder: "Master key", "data-autofocus": true });
  const err = h("p", { class: "error", role: "alert" });
  const btn = h("button", { type: "submit", class: "primary" }, "Unlock");
  async function submit(e) {
    e.preventDefault();
    if (!key.value) return;
    err.textContent = "";
    btn.disabled = true; btn.textContent = "Unlocking…";
    try {
      if (!cipher) cipher = (await dbGet(`Users/${encodeURIComponent(session.uid)}/keys`)) || {};
      const names = Object.keys(cipher).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
      if (!names.length) { err.textContent = "No saved passwords were found for this account."; return; }
      const out = await Promise.all(names.map(async (name) => {
        const rec = cipher[name] || {};
        const userId = await decrypt(rec.userId, key.value);
        const password = await decrypt(rec.password, key.value);
        return { name, userId, password, ok: !!(userId || password) };
      }));
      if (!out.some((x) => x.ok)) { err.textContent = "Wrong master key — nothing could be decrypted."; key.select(); return; }
      key.value = "";
      entries = out;
      armIdle();
      render(vaultView());
    } catch (e2) {
      if (/SESSION_EXPIRED/.test(String(e2.message))) { signOutNow(friendly(e2)); return; }
      err.textContent = "Couldn't load your passwords: " + friendly(e2);
    } finally {
      btn.disabled = false; btn.textContent = "Unlock";
    }
  }
  return shell(h("form", { class: "card", onsubmit: submit },
    h("h1", null, displayName ? `Hi, ${displayName}` : "Unlock vault"),
    h("p", { class: "muted" }, "Enter the master key you used on the app's “Get Keys” screen. It never leaves this browser."),
    h("label", { for: "mkey" }, "Master key"), key,
    err, btn,
    h("button", { type: "button", class: "link", onclick: () => signOutNow() }, "Sign out")));
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
        h("p", { class: "muted small" }, "Saved with a different key — can't decrypt with this one.")));
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
      h("div", { class: "row" }, h("span", { class: "label" }, "Password"), pw, eye, copyBtn(e.password, "Password"))));
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
      h("div", { class: "actions" },
        h("button", { type: "button", class: "ghost", onclick: lock }, icon("lock"), "Lock"),
        h("button", { type: "button", class: "ghost", onclick: () => signOutNow() }, "Sign out"))),
    h("div", { class: "summary" }, h("h1", null, "Saved passwords"), h("span", { class: "pill" }, `${okCount} of ${entries.length} unlocked`)),
    h("div", { class: "search-wrap" }, icon("search"), search),
    list, none, foot());
}

function lock() {
  entries = null;
  clearTimeout(idleTimer);
  render(session ? unlockView() : signInView());
}
function signOutNow(notice) {
  session = null; cipher = null; entries = null; displayName = "";
  clearTimeout(idleTimer);
  render(signInView(notice));
}
function armIdle() {
  clearTimeout(idleTimer);
  if (entries) idleTimer = setTimeout(() => { lock(); toast("Locked after inactivity"); }, IDLE_LOCK_MS);
}
for (const ev of ["pointerdown", "keydown", "scroll", "touchstart"]) addEventListener(ev, armIdle, { passive: true });

render(signInView());
})();
