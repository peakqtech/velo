import { parseArgs } from "node:util";
import { eject } from "./eject";

const { positionals } = parseArgs({ allowPositionals: true });

const appName = positionals[0];
if (!appName) {
  console.error("Usage: pnpm eject <app-name>");
  process.exit(1);
}

eject(appName);
