# Phase 1E: Verification Guide

This guide walks through completing Phase 1E and verifying that Milestone 1 is fully functional.

## 🎯 Prerequisites

Before starting Phase 1E, ensure you have:
- ✅ PostgreSQL database (Supabase or Neon)
- ✅ Database connection string
- ✅ pgvector extension capability
- ✅ Node.js 22+ installed
- ✅ pnpm package manager

## 📋 Step-by-Step Verification

### Step 1: Database Setup (15 minutes)

#### Option A: Supabase (Recommended)

1. **Create project:**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and set project name
   - Set a strong database password (save it!)
   - Wait for project to finish provisioning (~2 minutes)

2. **Enable pgvector:**
   - Go to SQL Editor in Supabase dashboard
   - Run this command:
     ```sql
     CREATE EXTENSION IF NOT EXISTS vector;
     ```
   - Click "Run" (should show success)

3. **Get connection string:**
   - Go to Project Settings → Database
   - Copy the "Connection string" (URI format)
   - It looks like: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`
   - Replace `[password]` with your actual password

#### Option B: Neon

1. **Create project:**
   - Go to [https://neon.tech](https://neon.tech)
   - Click "Create a project"
   - Set project name and region
   - Copy the connection string shown

2. **Enable pgvector:**
   - Go to SQL Editor
   - Run: `CREATE EXTENSION vector;`

### Step 2: Configure Environment (2 minutes)

```bash
cd deals-web
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required: Database connection
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# Required: Supabase (for auth/realtime features)
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_from_supabase
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional (for future use):
ANTHROPIC_API_KEY=your_claude_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=any_random_string_for_cron_auth
```

**Where to find Supabase keys:**
- Go to Project Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = "anon" / "public" key
- `SUPABASE_SERVICE_ROLE_KEY` = "service_role" key (keep secret!)

### Step 3: Install Dependencies (2 minutes)

```bash
cd deals-web
pnpm install
```

This will install all packages including:
- drizzle-orm
- postgres
- zod
- tsx
- Next.js and all UI dependencies

### Step 4: Run Database Migrations (1 minute)

```bash
pnpm db:push
```

**Expected output:**
```
No config path provided, using default path
Reading config file '/path/to/deals-web/drizzle.config.ts'
...
✅ Changes applied
```

**If you get errors:**
- Check DATABASE_URL is correct
- Verify pgvector extension is enabled
- Ensure database is accessible (firewall/network)

**Alternative (manual SQL):**
If `pnpm db:push` fails, run the SQL file directly:
```bash
# Via psql
psql $DATABASE_URL -f drizzle/0000_initial_schema.sql

# Or copy/paste contents of drizzle/0000_initial_schema.sql
# into Supabase SQL Editor
```

### Step 5: Seed Database (30 seconds)

```bash
pnpm db:seed
```

**Expected output:**
```
🌱 Seeding database...

📦 Inserting categories...
✅ 5 categories ready

🎁 Inserting sample deals...
✅ 23 deals inserted

📊 Summary:
   Categories: 5
   Deals: 23
   - Laptops: 5
   - Monitors: 4
   - SSDs: 5
   - GPUs: 4
   - Peripherals: 5

✨ Seeding complete!
```

### Step 6: Verify Database (1 minute)

Run the automated verification script:

```bash
pnpm verify
```

**Expected output:**
```
🔍 Milestone 1 Verification Checklist

==================================================

1️⃣  Checking database connection...
   ✅ Database connected

2️⃣  Checking pgvector extension...
   ✅ pgvector extension enabled

3️⃣  Checking categories table...
   ✅ Categories table has 5 categories

4️⃣  Checking deals table...
   ✅ Deals table has 23 deals
   📊 Active: 23, Expired: 0

5️⃣  Checking deals distribution by category...
   💻 Laptops: 5 deals
   🖥️ Monitors: 4 deals
   💾 SSDs: 5 deals
   🎮 GPUs: 4 deals
   ⌨️ Peripherals: 5 deals
   ✅ All categories have deals

6️⃣  Checking votes table...
   ✅ Votes table exists

7️⃣  Checking deal_embeddings table...
   ✅ Deal embeddings table exists

8️⃣  Checking ingest_log table...
   ✅ Ingest log table exists

==================================================

📊 VERIFICATION SUMMARY

   ✅ Passed: 8
   ❌ Failed: 0

🎉 All checks passed! Your database is ready.

   Next steps:
   1. Run: pnpm dev
   2. Visit: http://localhost:3000
   3. Verify Top 5 deals per category display correctly

==================================================
```

### Step 7: Start Development Server (10 seconds)

```bash
pnpm dev
```

**Expected output:**
```
  ▲ Next.js 15.3.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Starting...
 ✓ Ready in 2.1s
```

### Step 8: Manual UI Verification (3 minutes)

1. **Open browser:** http://localhost:3000

2. **Check home page:**
   - ✅ See "Top Tech Deals" heading
   - ✅ See 5 category sections (Laptops, Monitors, SSDs, GPUs, Peripherals)
   - ✅ Each category shows up to 5 deals
   - ✅ Each deal card shows:
     - Title
     - Price (current + strikethrough list price)
     - Discount % badge (red)
     - Merchant name
     - AI summary (2 lines)
     - Tags (up to 3)
     - Vote counts (👍👎)
     - "View Deal" button

3. **Check category pages:**
   - Click "View All" on any category
   - ✅ See category icon and name
   - ✅ See all deals for that category
   - ✅ "Back to Home" button works

4. **Check responsiveness:**
   - Resize browser window
   - ✅ Layout adapts (1 col → 2 → 3 → 5 columns)
   - ✅ Cards stack properly on mobile

### Step 9: Build Verification (2 minutes)

Test production build:

```bash
pnpm build
```

**Expected output:**
```
   ▲ Next.js 15.3.0

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (X/X)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    XXX kB         XXX kB
├ ○ /category/[slug]                     XXX kB         XXX kB
...

○  (Static)  prerendered as static content
```

**If build fails:**
- Check TypeScript errors: `pnpm tsc --noEmit`
- Verify DATABASE_URL is in `.env.local`
- Check for import errors

### Step 10: API Endpoint Testing (Optional)

Test API routes directly:

```bash
# Get all categories
curl http://localhost:3000/api/categories | jq

# Get deals (all)
curl http://localhost:3000/api/deals | jq

# Get deals (filtered by category)
curl "http://localhost:3000/api/deals?category=laptops&limit=5" | jq

# Get single deal (replace ID)
curl http://localhost:3000/api/deals/[deal-id] | jq
```

## ✅ Verification Checklist

Use this checklist to confirm Phase 1E completion:

### Database
- [ ] Database created (Supabase or Neon)
- [ ] pgvector extension enabled
- [ ] Migrations applied successfully
- [ ] 5 categories seeded
- [ ] 20+ sample deals seeded
- [ ] `pnpm verify` passes all checks

### UI/UX
- [ ] Home page loads without errors
- [ ] Top 5 deals per category displayed
- [ ] Deal cards show all information correctly
- [ ] Category pages accessible via "View All"
- [ ] Responsive layout works (mobile → desktop)
- [ ] No console errors in browser

### API
- [ ] GET /api/categories returns 5 categories
- [ ] GET /api/deals returns deals with filters
- [ ] GET /api/deals/[id] returns single deal
- [ ] All responses properly typed/validated

### Build
- [ ] `pnpm build` completes successfully
- [ ] No TypeScript errors
- [ ] Production build runs: `pnpm start`

### Code Quality
- [ ] All imports resolve correctly
- [ ] TypeScript strict mode (where enabled)
- [ ] No ESLint errors on new code
- [ ] Ranking algorithm tests exist

## 🚨 Troubleshooting

### "Cannot find module 'drizzle-orm'"

```bash
cd deals-web
pnpm install
```

### "Database connection failed"

1. Check DATABASE_URL format:
   ```
   postgresql://user:password@host:port/database
   ```
2. Verify network access (IP whitelist in Supabase)
3. Check password doesn't have special characters (URL-encode if needed)

### "pgvector extension not found"

Run in database SQL editor:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### "Cannot push to database" / Permission errors

- Use the connection string with the `postgres` role
- Supabase: Use the pooler connection string for migrations
- Neon: Ensure your role has CREATE privileges

### "Build fails with type errors"

1. Check `pnpm tsc --noEmit` output
2. Verify all dependencies installed: `pnpm install`
3. Check imports use `@/` alias correctly

### "No deals showing on home page"

1. Check browser console for errors
2. Verify deals seeded: `pnpm verify`
3. Check network tab for API call failures
4. Ensure `.env.local` has correct DATABASE_URL

## 📊 Success Metrics

Phase 1E is complete when:

1. **Database**: All 8 verification checks pass
2. **UI**: Home page shows Top 5 per category
3. **Build**: Production build succeeds
4. **API**: All 3 routes respond correctly
5. **Code**: No TypeScript/lint errors

## 🎉 Next Steps

Once Phase 1E passes:

1. **Celebrate!** Milestone 1 is complete! 🎊

2. **Plan Milestone 2**: Voting System
   - Vote API routes
   - Vote UI components
   - Score recalculation
   - User authentication

3. **Optional enhancements:**
   - Deploy to Vercel
   - Set up staging environment
   - Add more sample deals
   - Customize UI theme

## 📚 Reference

- **Seed script**: `deals-web/src/db/seed.ts`
- **Verification script**: `deals-web/scripts/verify.ts`
- **Database setup**: `deals-web/DATABASE_SETUP.md`
- **Progress tracking**: `PROGRESS.md`
- **Milestone summary**: `MILESTONE_1_SUMMARY.md`

---

**Need help?** Check the troubleshooting section or review the comprehensive documentation in `MILESTONE_1_SUMMARY.md`.
