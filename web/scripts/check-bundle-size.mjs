import { readdirSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const dist = join(import.meta.dirname, "..", "dist");
const manifest = JSON.parse(readFileSync(join(dist, ".vite/manifest.json"), "utf8"));
const initial = new Set();
const visited = new Set();
function include(key) {
  if (visited.has(key)) return;
  visited.add(key);
  const chunk = manifest[key];
  if (!chunk) throw new Error(`Missing build manifest entry: ${key}`);
  for (const file of [chunk.file, ...(chunk.css ?? [])]) initial.add(file);
  for (const imported of chunk.imports ?? []) include(imported);
}
include("index.html");

const total = readdirSync(join(dist, "assets")).map((file) => `assets/${file}`);
const budgets = [
  // +1 KB (155 -> 156): the "Labs" nav link and its i18n strings, shared by every page.
  { label: "Initial", files: initial, js: 156, css: 12 },
  // +88 KB (212 -> 300): hands-on labs' interactive terminal (ADR 0029: "a real interactive
  // terminal", chosen over a lighter file-write-only bridge after the product owner was told
  // what each costs) pulls in @xterm/xterm, a full ANSI/VT100 terminal emulator -- but only for
  // learners who open a lab, since LabSessionPage is its own lazily-loaded route and does not
  // add one byte to a page that never reaches it (Initial above is unaffected).
  { label: "Total", files: total, js: 300, css: 12 },
];
for (const budget of budgets) {
  for (const kind of ["js", "css"]) {
    const size = [...budget.files].filter((file) => file.endsWith(`.${kind}`))
      .reduce((sum, file) => sum + gzipSync(readFileSync(join(dist, file))).length, 0) / 1024;
    const over = size > budget[kind];
    if (over) process.exitCode = 1;
    console.log(`${over ? "FAIL" : "ok  "} ${budget.label} ${kind.toUpperCase()} ${size.toFixed(1)} KB gzip (budget ${budget[kind]} KB)`);
  }
}

for (const [key, chunk] of Object.entries(manifest)) {
  if (!chunk.isDynamicEntry) continue;
  const entryFiles = [...initial];
  include(key);
  const additional = [...initial].filter((file) => !entryFiles.includes(file) && file.endsWith(".js"));
  const kb = additional.reduce((sum, file) =>
    sum + gzipSync(readFileSync(join(dist, file))).length, 0) / 1024;
  console.log(`route ${key}: ${kb.toFixed(1)} KB additional JS gzip`);
  initial.clear();
  visited.clear();
  include("index.html");
}
