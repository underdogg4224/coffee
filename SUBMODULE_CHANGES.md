# Submodule Changes (Local Development)

## Note

The submodules `deals-web` and `claude-code-orchestra` point to public repositories where we don't have write access. All changes below are **local modifications** for development purposes.

---

## deals-web/ (Next.js Frontend)

### Files Created

#### Database Schema (`src/db/`)
- **schema/categories.ts** - Categories table (id, name, slug, icon, sort_order)
- **schema/deals.ts** - Deals table (full pricing, AI fields, status)
- **schema/votes.ts** - Votes table (user_id, deal_id, vote_type, unique constraint)
- **schema/deal_embeddings.ts** - Embeddings table (deal_id, vector(1536), HNSW index)
- **schema/ingest_log.ts** - Audit log table (stage, status, message, metadata)
- **schema/index.ts** - Schema exports
- **index.ts** - Drizzle database client
- **seed.ts** - Category seed script

#### API Routes (`src/app/api/`)
- **deals/route.ts** - GET /api/deals (list with filters)
- **deals/[id]/route.ts** - GET /api/deals/:id (single deal)
- **categories/route.ts** - GET /api/categories (all categories)

#### Library Functions (`src/lib/`)
- **ranking.ts** - Wilson score, time decay, quality contribution, combined scoring
- **ranking.test.ts** - Comprehensive ranking algorithm tests (15 tests)
- **deals-queries.ts** - Database query helpers (getDeals, getDealById, getTopDealsByCategory)

#### UI Components & Pages
- **src/components/DealCard.tsx** - Deal display component
- **src/app/(dynamic-pages)/(main-pages)/page.tsx** - Home page (Top 5 per category)
- **src/app/(dynamic-pages)/(main-pages)/category/[slug]/page.tsx** - Category detail page

#### Configuration & Migrations
- **drizzle.config.ts** - Drizzle ORM configuration
- **drizzle/0000_initial_schema.sql** - PostgreSQL migration file
- **.env.example** - Environment variables template
- **DATABASE_SETUP.md** - Database setup documentation

### Files Modified

- **package.json** - Added scripts:
  - `db:generate` - Generate migrations
  - `db:push` - Push schema to database
  - `db:migrate` - Run migrations
  - `db:studio` - Open Drizzle Studio
  - `db:seed` - Seed categories

### Dependencies Added

```json
{
  "dependencies": {
    "drizzle-orm": "latest",
    "postgres": "latest",
    "pg": "latest",
    "@neondatabase/serverless": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "drizzle-kit": "latest",
    "tsx": "latest"
  }
}
```

---

## claude-code-orchestra/ (AI Agents)

### Files Created

- **.gitignore** - Node.js + environment files
- **.env.example** - Environment template (ANTHROPIC_API_KEY, DATABASE_URL)

### Status

Ready for Milestone 5 (AI Orchestration). No code changes yet - will be configured when implementing:
- Fetcher agent
- Filter agent
- Summarizer agent
- Ranker agent
- Archivist agent

---

## How to Replicate

### For deals-web

1. **Install dependencies:**
   ```bash
   cd deals-web
   pnpm install
   pnpm add drizzle-orm postgres pg @neondatabase/serverless zod
   pnpm add -D drizzle-kit tsx
   ```

2. **Copy all files from this documentation to their respective paths**

3. **Set up database:**
   ```bash
   cp .env.example .env.local
   # Add your DATABASE_URL
   pnpm db:push
   pnpm db:seed
   ```

4. **Test:**
   ```bash
   pnpm dev
   ```

### For claude-code-orchestra

1. **Create config files:**
   ```bash
   cd claude-code-orchestra
   # Copy .gitignore and .env.example from documentation
   ```

2. **Will be configured in Milestone 5**

---

## Git Submodule Status

- Submodules point to upstream repos (no write access)
- All changes are local development modifications
- Changes documented here for reproducibility
- Consider forking repositories for permanent changes

---

## Full File Listing

### deals-web/ Structure
```
deals-web/
├── drizzle/
│   └── 0000_initial_schema.sql          # NEW
├── src/
│   ├── app/
│   │   ├── (dynamic-pages)/(main-pages)/
│   │   │   ├── page.tsx                 # MODIFIED (home page)
│   │   │   └── category/
│   │   │       └── [slug]/
│   │   │           └── page.tsx         # NEW
│   │   └── api/
│   │       ├── deals/
│   │       │   ├── route.ts             # NEW
│   │       │   └── [id]/
│   │       │       └── route.ts         # NEW
│   │       └── categories/
│   │           └── route.ts             # NEW
│   ├── components/
│   │   └── DealCard.tsx                 # NEW
│   ├── db/
│   │   ├── schema/
│   │   │   ├── index.ts                 # NEW
│   │   │   ├── categories.ts            # NEW
│   │   │   ├── deals.ts                 # NEW
│   │   │   ├── votes.ts                 # NEW
│   │   │   ├── deal_embeddings.ts       # NEW
│   │   │   └── ingest_log.ts            # NEW
│   │   ├── index.ts                     # NEW
│   │   └── seed.ts                      # NEW
│   └── lib/
│       ├── ranking.ts                   # NEW
│       ├── ranking.test.ts              # NEW
│       └── deals-queries.ts             # NEW
├── .env.example                         # NEW
├── drizzle.config.ts                    # NEW
├── DATABASE_SETUP.md                    # NEW
└── package.json                         # MODIFIED

claude-code-orchestra/
├── .gitignore                           # NEW
└── .env.example                         # NEW
```

---

## Technical Details

### Database Schema
- **PostgreSQL** with **pgvector** extension
- **5 tables** with proper indexes
- **Foreign keys** with cascade deletes
- **Unique constraints** on votes (one per user per deal)
- **Vector index** (HNSW) for similarity search

### Ranking Algorithm
- **Wilson Score** (95% confidence interval)
- **Time Decay** (exponential, 72hr half-life)
- **Quality Score** (0-10 scale, 15% weight)
- **Recency Boost** (< 6 hours old)

### API Design
- **RESTful** routes
- **Zod validation** on all inputs
- **Error handling** with proper status codes
- **Pagination** support

### UI/UX
- **Server-side rendering** (Next.js 15)
- **Tailwind CSS** + **shadcn/ui** components
- **Responsive** (mobile-first)
- **Empty states** handled
- **Fast** (direct DB queries, no unnecessary client JS)

---

## Next Steps

To apply these changes permanently:

1. **Fork both repositories** to your GitHub account
2. **Update submodule URLs** to point to your forks
3. **Commit and push** all changes to your forks
4. **Update parent repo** submodule references

Or:

1. **Copy all files** to a fresh Next.js project (not a submodule)
2. **Initialize as new repo** under your control
3. **Cherry-pick** features from nextbase starter as needed
