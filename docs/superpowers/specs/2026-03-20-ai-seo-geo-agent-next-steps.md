# AI SEO & GEO Agent — Manual Next Steps

**Date:** 2026-03-20
**Status:** Post-implementation — what needs to be done manually before going live

---

## 1. Environment Variables (Required)

Add these to your production environment (Vercel dashboard or `.env.production`):

```bash
# Cron endpoint security
CRON_SECRET=<generate-a-strong-random-string>

# GEO Monitor — AI Engine API Keys
OPENAI_API_KEY=<your-openai-key>          # For ChatGPT engine queries
PERPLEXITY_API_KEY=<your-perplexity-key>  # For Perplexity engine queries
GOOGLE_AI_API_KEY=<your-gemini-key>       # For Gemini engine queries
SERPAPI_API_KEY=<your-serpapi-key>         # For AI Overview extraction
```

**Where to get them:**
- OpenAI: https://platform.openai.com/api-keys
- Perplexity: https://docs.perplexity.ai/guides/getting-started
- Google AI: https://aistudio.google.com/apikey
- SerpAPI: https://serpapi.com/manage-api-key

---

## 2. Vercel Cron Setup (Required)

Add to `vercel.json` in the dashboard app (or project root):

```json
{
  "crons": [
    {
      "path": "/api/cron/agent-loop",
      "schedule": "0 6 * * *"
    }
  ]
}
```

This runs the agent loop daily at 6 AM UTC. Adjust timezone as needed.

**Important:** The cron endpoint requires `CRON_SECRET` as a Bearer token. Vercel automatically sends this for configured crons.

---

## 3. Seed Test Data (Recommended)

Once the DB connection is stable:

```bash
cd packages/infra/db
pnpm db:seed-agent
```

This creates sample AgentConfig, runs, opportunities, snapshots, and GeoScores for development.

---

## 4. Fix Database Connection (Required for local dev)

The pooler endpoint (`aws-1-ap-southeast-2.pooler.supabase.com:5432`) is unreachable from your machine. Options:

**Option A — Use Session Mode (port 5432 direct):**
Update `DIRECT_URL` in `packages/infra/db/.env`:
```
DIRECT_URL=postgresql://postgres.qknyogarrqxkjpcizvga:[PASSWORD]@db.qknyogarrqxkjpcizvga.supabase.co:5432/postgres
```

**Option B — Use Transaction Mode (port 6543):**
Your `DATABASE_URL` already uses port 6543 with `?pgbouncer=true` — this works for runtime queries. Only the `DIRECT_URL` (used for migrations) needs the direct host.

**Option C — Run locally:**
Use a local PostgreSQL instance for development. Update both URLs to `postgresql://postgres:password@localhost:5432/velo`.

---

## 5. Remaining Features to Build

### Needs API Keys (can build once keys are set up):

| Feature | Effort | What it does |
|---------|--------|-------------|
| **KeywordAnalyzer** | Medium | GSC API + SerpAPI integration. Finds keyword gaps. Fills AgentLoop step 1-2 TODO stubs. |
| **CompetitorAnalyzer** | Medium | RSS/sitemap crawling of competitor URLs. Detects new competitor content. |
| **Email Notifications** | Medium | Veto alerts, approval reminders, weekly digests. Needs Resend or SendGrid. |

### Can build without API keys:

| Feature | Effort | What it does |
|---------|--------|-------------|
| **JSON-LD Structured Data** | Small | Add JSON-LD schema generation to seo-engine formatters for GEO optimization. |
| **CompetitorAnalyzer (RSS part)** | Medium | RSS/sitemap parser for public URLs. No API key needed, just `fetch`. |

### Priority order:
1. KeywordAnalyzer — unlocks the full intelligence engine (Signal 1)
2. CompetitorAnalyzer — completes Signal 2
3. JSON-LD — makes generated content GEO-optimized
4. Email Notifications — enables veto/approval workflow notifications

---

## 6. First Client Onboarding Checklist

When setting up the first real client on the agent:

1. **Create AgentConfig** via dashboard (`/seo/[siteId]/agent`) or API:
   - Set tier (GROWTH recommended to start)
   - Enable channels (BLOG + GBP minimum)
   - Set cadence (start conservative: 1 blog/week)
   - Set oversight to VETO_WINDOW (24h) for safety
   - Add 2-3 competitor URLs
   - Add 5-10 seed keywords for the vertical
   - Add 3-5 GEO query prompts

2. **Monitor first runs** via dashboard (`/seo/[siteId]/agent` → run history)

3. **Review opportunities** at `/seo/[siteId]/opportunities`

4. **Check GEO visibility** at `/seo/[siteId]/geo` after first week of monitoring

5. **Upgrade to AUTO_PUBLISH** once you're confident in content quality

---

## 7. Cost Estimation

| Service | Usage | Monthly Cost (per client) |
|---------|-------|--------------------------|
| OpenAI (ChatGPT queries) | ~20-100 queries/week | $1-5 |
| Perplexity API | ~20-100 queries/week | $1-5 |
| Google AI (Gemini) | ~20-100 queries/week | $0.50-2 |
| SerpAPI (AI Overviews) | ~20-100 queries/week | $5-25 |
| Claude (content generation) | ~2-10 pieces/week | $2-15 |
| **Total per client** | | **$10-52/month** |

At Growth tier ($499-799/mo), this gives healthy margins.
