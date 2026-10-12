#!/usr/bin/env node
// Usage: node content/stage-editorial-pack.mjs <source-pack-dir> <new-output-dir>
// Then:  java content/ContentImporter.java --pack <new-output-dir> --dry-run
//        java content/ContentImporter.java --pack <new-output-dir> --email ...
// This command never authenticates, sends network traffic, approves or publishes a question.
import { stageEditorialPack } from "./editorial-pack.mjs";

const [source, destination] = process.argv.slice(2);
if (!source || !destination || process.argv.length !== 4) {
  console.error("Usage: node content/stage-editorial-pack.mjs <source-pack-dir> <new-output-dir>");
  process.exitCode = 2;
} else {
  try {
    const result = stageEditorialPack(source, destination);
    console.log(`staged ${result.count} draft request(s) for ${result.trackSlug} at ${result.destinationDir}`);
    console.log(`Preflight: java content/ContentImporter.java --pack "${destination}" --dry-run`);
    console.log("Review and submit with an authorized CONTENT_AUTHOR account; publication remains manual.");
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}
