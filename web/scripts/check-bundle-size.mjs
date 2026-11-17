// Holds the built app to a size budget. Sizes are of the gzip-compressed JavaScript and CSS the
// browser downloads on first load; fonts are separate files and are not counted. Deterministic, so
// unlike a timing budget it can be tight.
import { readdirSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const dir = join(import.meta.dirname, "..", "dist", "assets");
// js raised from 170 to 190 on 2026-11-14 for react-syntax-highlighter (PrismLight, 4 grammars:
// java/yaml/dockerfile/hcl) — v0.4.0's syntax-highlighted code presentation, a real, reviewed
// feature cost, not untracked bloat.
const BUDGET_KB = { js: 190, css: 12 };

const total = { js: 0, css: 0 };
for (const file of readdirSync(dir)) {
  const kind = file.endsWith(".js") ? "js" : file.endsWith(".css") ? "css" : null;
  if (kind) total[kind] += gzipSync(readFileSync(join(dir, file))).length;
}

let failed = false;
for (const kind of ["js", "css"]) {
  const kb = total[kind] / 1024;
  const over = kb > BUDGET_KB[kind];
  failed ||= over;
  console.log(`${over ? "FAIL" : "ok  "} ${kind.toUpperCase()} ${kb.toFixed(1)} KB gzip (budget ${BUDGET_KB[kind]} KB)`);
}
if (failed) {
  process.exit(1);
}
