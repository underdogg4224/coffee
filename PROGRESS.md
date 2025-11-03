# AI Deals Site - Build Progress

## ✅ Completed

### Initial Setup
- [x] Cloned `deals-web` (Next.js + Supabase starter)
- [x] Cloned `claude-code-orchestra` (AI agent framework)
- [x] Created `.gitignore` for both repos
- [x] Created `.env.example` with DB + Claude API keys

### Phase 1A: Database Schema & Setup
- [x] Installed Drizzle ORM, postgres, pg, zod, tsx dependencies
- [x] Created Drizzle config (`drizzle.config.ts`)
- [x] Defined all 5 schemas:
  - `categories.ts` (id, name, slug, icon, sort_order)
  - `deals.ts` (full spec with pricing, AI fields, status)
  - `votes.ts` (user_id, deal_id, vote_type, unique constraint)
  - `deal_embeddings.ts` (deal_id, vector(1536), HNSW index)
  - `ingest_log.ts` (stage, status, message, metadata)
- [x] Created database client (`src/db/index.ts`)
- [x] Generated SQL migration (`drizzle/0000_initial_schema.sql`)
- [x] Created seed script (`src/db/seed.ts`) for 5 categories
- [x] Added package.json scripts (db:generate, db:push, db:seed, db:studio)
- [x] Created `DATABASE_SETUP.md` documentation

### Phase 1B: Ranking Logic
- [x] Created `src/lib/ranking.ts` with:
  - Wilson score calculation (conservative upvote/downvote ratio)
  - Time decay formula (exponential with 72hr half-life)
  - Quality score weighting (15% contribution)
  - Combined score function
  - Deal ranking utility
- [x] Created comprehensive tests (`src/lib/ranking.test.ts`)
  - Wilson score tests
  - Time decay tests
  - Quality contribution tests
  - Combined score tests
  - Deal ranking tests

### Phase 1C: API Routes
- [x] Created database query helpers (`src/lib/deals-queries.ts`):
  - `getDeals()` with filters (category, status, limit, offset)
  - `getDealById()` for single deal
  - `getTopDealsByCategory()` for Top 5 per category
- [x] Created `/api/deals` route (GET with query validation)
- [x] Created `/api/deals/[id]` route (GET single deal)
- [x] Created `/api/categories` route (GET all categories)

## 🚧 In Progress

### Phase 1D: Home Page UI
- [ ] Install shadcn/ui components (card, badge, button)
- [ ] Create `DealCard` component
- [ ] Create home page (`app/page.tsx`) with Top 5 per category
- [ ] Create category page (`app/category/[slug]/page.tsx`)

### Phase 1E: Verification
- [ ] Seed sample deals (3-5 per category)
- [ ] Verify home page shows Top 5 per category
- [ ] Verify category pages work
- [ ] Run `pnpm build` successfully
- [ ] Verify TypeScript strict mode passes

## 📋 Remaining (Future Milestones)

### Milestone 2: Voting System
- [ ] Vote API routes (POST /api/votes)
- [ ] Vote UI components
- [ ] Score recalculation on vote
- [ ] User authentication integration

### Milestone 3: AI Summaries
- [ ] Claude SDK integration
- [ ] Summarizer agent (≤25 words, factual)
- [ ] Summary generation on deal ingest
- [ ] Display summaries in UI

### Milestone 4: Archive Cron Job
- [ ] Vercel Cron setup
- [ ] Archive API route
- [ ] Expire deals logic (check expires_at)
- [ ] Update status to 'expired'
- [ ] Logging to ingest_log

### Milestone 5: AI Orchestra Integration
- [ ] Fetcher agent
- [ ] Filter agent
- [ ] Ranker agent (quality_score)
- [ ] Full pipeline orchestration
- [ ] Scheduled ingestion

## 📂 File Structure Created

```
deals-web/
├── drizzle/
│   └── 0000_initial_schema.sql
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── deals/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       └── categories/
│   │           └── route.ts
│   ├── db/
│   │   ├── schema/
│   │   │   ├── index.ts
│   │   │   ├── categories.ts
│   │   │   ├── deals.ts
│   │   │   ├── votes.ts
│   │   │   ├── deal_embeddings.ts
│   │   │   └── ingest_log.ts
│   │   ├── index.ts
│   │   └── seed.ts
│   └── lib/
│       ├── ranking.ts
│       ├── ranking.test.ts
│       └── deals-queries.ts
├── .env.example
├── drizzle.config.ts
├── DATABASE_SETUP.md
└── package.json (updated with db scripts)

claude-code-orchestra/
├── .gitignore
└── .env.example
```

## 🎯 Next Steps

1. Install shadcn/ui components
2. Create DealCard component
3. Build home page with Top 5 deals per category
4. Create category detail pages
5. Seed test data
6. Verify build passes

## 📝 Notes

- Submodules are from public repos (no write access)
- All changes are local for development
- Tests written but vitest installation needs fixing
- Database migration ready for Supabase/Neon
- pgvector extension must be enabled before migration
