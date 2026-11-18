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
  { label: "Initial", files: initial, js: 155, css: 12 },
  { label: "Total", files: total, js: 212, css: 12 },
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
