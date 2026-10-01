// Fails when src/api/schema.d.ts is not exactly what openapi.json generates, so the committed types
// can never drift from the committed contract. Regenerate with `npm run api:generate`.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "api-types-"));
const out = join(dir, "schema.d.ts");
try {
  execFileSync("npx", ["openapi-typescript", "openapi.json", "-o", out], { stdio: "ignore", shell: true });
  const normalize = (text) => text.replace(/\r\n/g, "\n");
  const generated = normalize(readFileSync(out, "utf8"));
  const committed = normalize(readFileSync("src/api/schema.d.ts", "utf8"));
  if (generated !== committed) {
    console.error("src/api/schema.d.ts is out of date with openapi.json. Run: npm run api:generate");
    process.exit(1);
  }
  console.log("API types match the contract.");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
