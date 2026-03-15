import { parseArgs } from "node:util";
import { QAPipeline } from "./pipeline";
import { createLighthouseAudit } from "./audits/lighthouse";
import { createA11yAudit } from "./audits/accessibility";
import { createLinkChecker } from "./audits/links";
import { createMetaAudit } from "./audits/meta";
import { saveReport, formatReportText } from "./report";

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    output: { type: "string", short: "o", default: "./qa-reports" },
    skip: { type: "string", short: "s" },
  },
});

const url = positionals[0];
if (!url) {
  console.error("Usage: pnpm qa <url> [--output <dir>] [--skip lighthouse,a11y]");
  console.error("\nAudits: lighthouse, accessibility, links, meta");
  process.exit(1);
}

const skip = new Set((values.skip ?? "").split(",").filter(Boolean));

async function main() {
  console.log(`\n🔍 Running QA audit on ${url}...\n`);

  const pipeline = new QAPipeline(url);

  if (!skip.has("lighthouse")) pipeline.register(createLighthouseAudit());
  if (!skip.has("a11y") && !skip.has("accessibility")) pipeline.register(createA11yAudit());
  if (!skip.has("links")) pipeline.register(createLinkChecker());
  if (!skip.has("meta")) pipeline.register(createMetaAudit());

  const report = await pipeline.run();

  console.log(formatReportText(report));

  const outDir = values.output ?? "./qa-reports";
  const { json, text } = saveReport(report, outDir);
  console.log(`\n📄 Reports saved:`);
  console.log(`   JSON: ${json}`);
  console.log(`   Text: ${text}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
