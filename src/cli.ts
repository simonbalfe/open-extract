#!/usr/bin/env bun

import { extract } from "./extract.ts";

function usage(): never {
  console.error("Usage: open-extract <url>");
  process.exit(2);
}

const args = process.argv.slice(2);
if (args.length !== 1 || args[0] === "--help" || args[0] === "-h") usage();

try {
  const result = await extract(args[0] ?? "");
  console.log(JSON.stringify(result, null, 2));
  if (result.outcome !== "ok") process.exitCode = 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
