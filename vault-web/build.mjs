// Inlines src/main.js into a single index.html and writes vercel.json with a
// CSP that only allows that exact inline script (by SHA-256 hash).
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const js = readFileSync(join(here, "src/main.js"), "utf8").trim();
const html = readFileSync(join(here, "src/template.html"), "utf8").replace("/*BUNDLE*/", () => "\n" + js + "\n");
const inline = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const hash = createHash("sha256").update(inline, "utf8").digest("base64");

const csp = [
  "default-src 'none'",
  `script-src 'sha256-${hash}'`,
  "style-src 'unsafe-inline'",
  "img-src data:",
  "connect-src https://identitytoolkit.googleapis.com https://homeallowance-ff1fa-default-rtdb.firebaseio.com",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join("; ");

const vercel = {
  headers: [{
    source: "/(.*)",
    headers: [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Cache-Control", value: "no-store" },
    ],
  }],
};

writeFileSync(join(here, "index.html"), html);
writeFileSync(join(here, "vercel.json"), JSON.stringify(vercel, null, 2) + "\n");
const sha1 = (s) => createHash("sha1").update(s, "utf8").digest("hex");
console.log(`index.html ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB sha1=${sha1(html)}`);
console.log(`vercel.json sha1=${sha1(JSON.stringify(vercel, null, 2) + "\n")}`);
