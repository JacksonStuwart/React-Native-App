// Inlines src/main.js into a single offline index.html with a CSP that only
// allows that exact inline script (by SHA-256 hash) and blocks all network access.
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const js = readFileSync(join(here, "src/main.js"), "utf8").trim();
const html = readFileSync(join(here, "src/template.html"), "utf8").replace("/*BUNDLE*/", () => "\n" + js + "\n");
const inline = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const hash = createHash("sha256").update(inline, "utf8").digest("base64");

// Meta CSP: only this page's own script may run, and it may not contact any server.
const csp = [
  "default-src 'none'",
  `script-src 'sha256-${hash}'`,
  "style-src 'unsafe-inline'",
  "img-src data:",
  "connect-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");
const out = html.replace("/*CSP*/", csp);

writeFileSync(join(here, "index.html"), out);
const sha1 = (s) => createHash("sha1").update(s, "utf8").digest("hex");
console.log(`index.html ${(Buffer.byteLength(out) / 1024).toFixed(1)} KB sha1=${sha1(out)}`);
