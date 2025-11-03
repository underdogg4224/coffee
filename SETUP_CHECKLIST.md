# BeanzNeez.com Setup Checklist

**Domain:** BeanzNeez.com
**Hosting:** Hostinger
**Status:** WordPress Installation Phase

---

## ✅ Phase 1: Foundation (COMPLETED)
- [x] Choose domain name → **BeanzNeez.com**
- [x] Register domain
- [x] Purchase hosting → **Hostinger**

---

## 🔧 Phase 2: WordPress Setup (IN PROGRESS)

### Step 1: Install WordPress on Hostinger

**How to install WordPress on Hostinger:**

1. **Log into Hostinger control panel** (hPanel)
   - Go to: https://www.hostinger.com/cpanel-login
   - Use your Hostinger credentials

2. **Find "Auto Installer" or "WordPress"**
   - Look for "Website" section in hPanel
   - Click "Auto Installer" or "Install WordPress"
   - OR look for "WordPress" icon

3. **WordPress Installation Settings:**
   ```
   Domain: BeanzNeez.com (select from dropdown)
   Directory: Leave EMPTY (install at root)
   Site Title: BeanzNeez
   Site Description: Fresh Coffee Deals Daily
   Admin Username: (choose a secure username, NOT "admin")
   Admin Password: (use a strong password generator)
   Admin Email: (your real email)
   Language: English
   ```

4. **Click "Install"**
   - Wait 1-2 minutes
   - You'll get confirmation with login URL

5. **Save these credentials securely:**
   ```
   WordPress Admin URL: https://BeanzNeez.com/wp-admin
   Username: _______________
   Password: _______________
   ```

**Expected time:** 5-10 minutes

---

### Step 2: Initial WordPress Configuration

Once WordPress is installed:

1. **Log into WordPress dashboard**
   - Go to: https://BeanzNeez.com/wp-admin
   - Enter username and password

2. **Settings → General**
   ```
   Site Title: BeanzNeez
   Tagline: Fresh Coffee Deals from 1,000+ Specialty Roasters
   WordPress Address (URL): https://BeanzNeez.com
   Site Address (URL): https://BeanzNeez.com
   Email Address: (your email)
   Timezone: (your timezone)
   Date Format: (choose preferred)
   Time Format: (choose preferred)
   ```
   - Click "Save Changes"

3. **Settings → Permalinks**
   - Select "Post name" (most SEO-friendly)
   - Custom Structure should show: `/%postname%/`
   - Click "Save Changes"
   - This gives you URLs like: BeanzNeez.com/stumptown-coffee-deal

4. **Settings → Reading**
   ```
   Your homepage displays: A static page (select later)
   Blog pages show at most: 10 posts
   Search engine visibility: UNCHECKED (allow indexing)
   ```
   - Click "Save Changes"

5. **Users → Your Profile**
   - Set a display name (not your username)
   - Add bio (optional)
   - Click "Update Profile"

**Expected time:** 10 minutes

---

### Step 3: SSL Certificate Setup

**Ensure your site uses HTTPS:**

1. **In Hostinger hPanel:**
   - Go to "SSL" section
   - Find BeanzNeez.com
   - Click "Install SSL" or "Activate SSL"
   - Choose "Free SSL" (Let's Encrypt)
   - Wait 5-10 minutes for activation

2. **Force HTTPS redirect:**
   - In Hostinger: Look for "Force HTTPS" toggle and enable it
   - OR install "Really Simple SSL" plugin in WordPress (easier)

3. **Verify:**
   - Visit https://BeanzNeez.com
   - You should see a lock icon in browser

**Expected time:** 10-15 minutes (mostly waiting)

---

## 🎨 Phase 3: Theme Installation

### Install Astra Theme

1. **In WordPress Dashboard:**
   - Go to: Appearance → Themes
   - Click "Add New"
   - Search for "Astra"
   - Click "Install" on Astra theme (by Brainstorm Force)
   - Click "Activate"

2. **Skip Starter Templates (for now)**
   - If prompted to install starter templates, skip it
   - We'll build custom layout

3. **Astra Settings:**
   - Go to: Appearance → Customize
   - Click "Global" → "Colors"
   - Set color scheme:
     ```
     Theme Color: #6F4E37 (coffee brown)
     Link Color: #C19A6B (lighter coffee)
     Text Color: #2C2C2C (dark gray)
     Background: #FFFFFF (white)
     ```
   - Click "Publish"

**Alternative themes (if you don't like Astra):**
- GeneratePress (also lightweight)
- Kadence (more modern)
- OceanWP (more features)

**Expected time:** 10 minutes

---

## 🔌 Phase 4: Essential Plugins

### Install These Plugins (In Order)

1. **Yoast SEO** (Search engine optimization)
   - Plugins → Add New → Search "Yoast SEO"
   - Install and Activate
   - Follow setup wizard (can skip for now)

2. **WP Coupons & Deals** (Deal posting system)
   - Plugins → Add New → Search "WP Coupons and Deals"
   - Install and Activate
   - OR try "Easy Coupons" if you prefer

3. **ThirstyAffiliates** (Link cloaking)
   - Plugins → Add New → Search "ThirstyAffiliates"
   - Install and Activate (free version is fine)

4. **MailChimp for WordPress** (Email list)
   - Plugins → Add New → Search "MC4WP"
   - Install and Activate
   - You'll need to create free MailChimp account later

5. **MonsterInsights** (Google Analytics)
   - Plugins → Add New → Search "MonsterInsights"
   - Install and Activate (free version OK)
   - Connect Google Analytics later

6. **Really Simple SSL** (Force HTTPS)
   - Only if Hostinger didn't auto-enable HTTPS
   - Plugins → Add New → Search "Really Simple SSL"
   - Install and Activate
   - Click "Activate SSL" button

**Optional but recommended:**
- **LiteSpeed Cache** - Hostinger works great with this (speed)
- **Wordfence Security** - Security and firewall
- **UpdraftPlus** - Automatic backups

**Expected time:** 20-30 minutes

---

## 📄 Phase 5: Create Core Pages

### Create These Pages

1. **Homepage**
   - Pages → Add New
   - Title: "Home"
   - Content: (leave blank for now, we'll design it)
   - Click "Publish"

2. **About Page**
   - Pages → Add New
   - Title: "About BeanzNeez"
   - Content:
   ```
   # About BeanzNeez

   We're coffee lovers on a mission to help you discover amazing
   specialty coffee without breaking the bank.

   Every day, we curate the best deals from over 1,000 specialty
   coffee roasters across the United States. From single-origin
   beans to subscription boxes to brewing equipment, we find the
   deals so you can focus on enjoying great coffee.

   ## Why Trust Us?

   - **Independently verified deals** - We check every deal personally
   - **No fluff** - Only real discounts from legitimate roasters
   - **Coffee obsessed** - We're enthusiasts who know quality

   ## How We Make Money

   We earn a small commission when you purchase through our links.
   This helps us keep the site running and deals fresh. You never
   pay more - in fact, you save money!

   Questions? Contact us at hello@beanzneez.com
   ```
   - Click "Publish"

3. **Contact Page**
   - Pages → Add New
   - Title: "Contact"
   - Content:
   ```
   # Get in Touch

   Have a question? Found an amazing deal we missed? Want to
   partner with us?

   **Email:** hello@beanzneez.com

   **Submit a Deal:** Use our [Submit a Deal](/submit-deal) form

   **Response Time:** We typically respond within 24 hours
   ```
   - Click "Publish"

4. **Affiliate Disclosure Page** (REQUIRED for FTC compliance)
   - Pages → Add New
   - Title: "Affiliate Disclosure"
   - Content:
   ```
   # Affiliate Disclosure

   BeanzNeez.com participates in affiliate marketing programs.
   This means we may earn a commission when you click on links
   and make purchases through our site.

   ## What This Means For You

   - **You never pay more** - Prices are the same (or better with our deals)
   - **We only recommend products we trust** - Deals are independently verified
   - **Commissions help us run the site** - This allows us to provide free content

   ## Affiliate Programs We Participate In

   We are a participant in the Amazon Services LLC Associates Program,
   an affiliate advertising program designed to provide a means for us
   to earn fees by linking to Amazon.com and affiliated sites.

   We also participate in affiliate programs with various coffee roasters
   and retailers.

   ## Our Promise

   Our recommendations are based on quality and value, not commission rates.
   We will always disclose when content contains affiliate links.

   **Last Updated:** November 3, 2025

   Questions? Contact us at hello@beanzneez.com
   ```
   - Click "Publish"

5. **Privacy Policy Page**
   - Pages → Add New
   - Title: "Privacy Policy"
   - WordPress has a template: Tools → Privacy Policy Generator
   - Customize as needed
   - Click "Publish"

6. **Submit a Deal Page** (For user submissions - later)
   - Pages → Add New
   - Title: "Submit a Deal"
   - Content: "Coming soon - we'll add a form here"
   - Click "Publish" but set to "Draft" for now

**Expected time:** 30-45 minutes

---

## 🎯 Phase 6: Create Navigation Menu

1. **Appearance → Menus**
2. **Create new menu:**
   - Menu Name: "Main Menu"
   - Click "Create Menu"

3. **Add pages to menu:**
   - Check: Home, About, Contact
   - Click "Add to Menu"

4. **Arrange menu items:**
   ```
   Deals (we'll add this later as category link)
   Blog
   Submit Deal
   About
   Contact
   ```

5. **Set menu location:**
   - Check "Primary Menu" (or "Main Menu")
   - Click "Save Menu"

6. **Create Footer Menu:**
   - Create new menu: "Footer Menu"
   - Add: Privacy Policy, Affiliate Disclosure, Contact
   - Set location to "Footer"
   - Click "Save Menu"

**Expected time:** 10 minutes

---

## 🏪 Phase 7: Configure Deal Posting

### Set Up WP Coupons & Deals Plugin

1. **Coupons → Settings**
   - Deal Categories: Enable
   - Expiration Notices: Enable
   - Vote System: Enable (optional)

2. **Create Deal Categories:**
   - Coupons → Categories → Add New
   - Create these categories:
     ```
     - Coffee Beans
     - Coffee Subscriptions
     - Grinders
     - Espresso Machines
     - Brewing Equipment
     - Accessories
     ```

3. **Create first test deal:**
   - Coupons → Add New
   - Title: "25% Off Stumptown Coffee" (example)
   - Description: "Get 25% off all whole bean coffee from Stumptown"
   - Coupon Code: "SAVE25"
   - Link: (affiliate link - we'll add later)
   - Category: Coffee Beans
   - Expiration Date: (set a week out)
   - Click "Publish"

**Expected time:** 15 minutes

---

## 📧 Phase 8: Set Up Email Capture

### Configure MailChimp

1. **Create MailChimp account:**
   - Go to: https://mailchimp.com/
   - Sign up for FREE plan (up to 500 subscribers)
   - Verify email

2. **Create Audience:**
   - In MailChimp dashboard: Audience → Create Audience
   - Name: "BeanzNeez Subscribers"
   - Default email: hello@beanzneez.com

3. **Get API Key:**
   - Account → Settings → Extras → API Keys
   - Create A Key
   - Copy the API key

4. **Connect to WordPress:**
   - In WordPress: MailChimp for WP → MailChimp
   - Paste API key
   - Select your audience
   - Save

5. **Create signup form:**
   - MailChimp for WP → Forms
   - Edit default form or create new
   - Simple form code:
   ```html
   <p>
   <label>Email Address</label>
   <input type="email" name="EMAIL" required />
   </p>
   <p>
   <input type="submit" value="Get Daily Deals" />
   </p>
   ```

6. **Add form to sidebar:**
   - Appearance → Widgets
   - Add "MailChimp for WordPress" widget to sidebar
   - Title: "Never Miss a Deal"
   - Description: "Get the best coffee deals in your inbox"

**Expected time:** 20 minutes

---

## 💰 Phase 9: Apply to Affiliate Programs

### Priority 1: Amazon Associates

**Apply NOW (takes 1-2 days for approval):**

1. **Go to:** https://affiliate-program.amazon.com/
2. **Click "Sign Up"**
3. **Fill out application:**
   ```
   Account Info: Your personal details
   Website: https://BeanzNeez.com
   Website Description: "Coffee deals aggregator featuring
   discounts from specialty roasters, subscriptions, and equipment"

   Traffic: 0-500 visitors/month (be honest)

   How do you drive traffic?
   - "SEO, social media, coffee communities"

   How do you monetize?
   - "Affiliate commissions, display advertising"

   Topics: Coffee, Food & Beverage, Kitchen & Dining
   ```

4. **Important:**
   - You need 3+ sales within 180 days or account closes
   - Start posting coffee product links ASAP
   - We'll make sure you hit this threshold

**Expected time:** 15 minutes

### Priority 2: ShareASale

1. **Go to:** https://www.shareasale.com/
2. **Click "Affiliate Sign Up"**
3. **Fill out publisher application**
4. **Once approved, search for:**
   - Coffee brands
   - Kitchen equipment brands
   - Any relevant merchants

**Apply after WordPress is fully set up**

---

## 🎨 Phase 10: Design Homepage

### Simple Homepage Layout

1. **Appearance → Customize → Homepage Settings**
   - Your homepage displays: A static page
   - Homepage: Select "Home"
   - Posts page: Create new page called "Blog"
   - Save

2. **Edit Homepage (with Elementor or Gutenberg):**

   **Hero Section:**
   ```
   Headline: "Fresh Coffee Deals from 1,000+ Specialty Roasters"
   Subhead: "Save up to 50% on premium coffee beans, subscriptions & equipment"
   CTA Button: "View Today's Deals" → links to /deals
   Email signup form
   ```

   **Featured Deals Section:**
   - Display 6-8 latest deals
   - Grid layout
   - Show: Title, discount %, roaster, "Get Deal" button

   **Categories Section:**
   - 6 category boxes with icons
   - Coffee Beans, Subscriptions, Grinders, etc.

   **Email Signup (again):**
   - "Never miss a deal" section
   - Prominent form

**Use Elementor (free) or Gutenberg blocks for easy design**

**Expected time:** 1-2 hours

---

## 📊 Phase 11: Analytics Setup

### Google Analytics 4

1. **Create GA4 account:**
   - Go to: https://analytics.google.com/
   - Create account: "BeanzNeez"
   - Property: "BeanzNeez.com"
   - Copy Measurement ID (starts with G-)

2. **Connect to WordPress:**
   - MonsterInsights → Settings → Authentication
   - Connect your Google account
   - Select BeanzNeez property
   - Complete setup

3. **Verify tracking:**
   - Visit your site
   - Check GA4 Realtime report
   - You should see 1 active user (you!)

### Google Search Console

1. **Go to:** https://search.google.com/search-console
2. **Add property:** BeanzNeez.com
3. **Verify ownership:**
   - Use "HTML tag" method
   - Yoast SEO can help with this
   - OR use Google Analytics verification

4. **Submit sitemap:**
   - Yoast SEO creates sitemap at: BeanzNeez.com/sitemap_index.xml
   - In Search Console: Sitemaps → Add sitemap
   - Enter: sitemap_index.xml
   - Submit

**Expected time:** 20 minutes

---

## ✅ Launch Checklist

### Before Going Live

- [ ] WordPress installed and accessible
- [ ] SSL certificate active (HTTPS working)
- [ ] Astra theme installed and customized
- [ ] All 6 essential plugins installed
- [ ] Permalink structure set to "Post name"
- [ ] 5 core pages created (About, Contact, Disclosure, Privacy, Home)
- [ ] Navigation menus configured
- [ ] Deal categories created
- [ ] At least 1 test deal posted
- [ ] Email signup form working
- [ ] Amazon Associates application submitted
- [ ] Google Analytics connected and tracking
- [ ] Search Console verified and sitemap submitted

### Before Heavy Promotion

- [ ] 20+ real deals posted
- [ ] 3+ blog posts written
- [ ] Homepage designed and looking good
- [ ] All links tested and working
- [ ] Mobile responsive verified
- [ ] Page speed tested (GTmetrix.com)
- [ ] Affiliate disclosure visible on all deal pages
- [ ] Social media accounts created (@BeanzNeez)

---

## 📅 Realistic Timeline

**Day 1 (Today):**
- ✅ Domain registered
- ✅ Hosting purchased
- [ ] WordPress installed
- [ ] Basic settings configured
- [ ] SSL enabled

**Day 2:**
- [ ] Theme installed
- [ ] Plugins installed
- [ ] Pages created
- [ ] Menu configured

**Day 3:**
- [ ] Amazon Associates application
- [ ] MailChimp setup
- [ ] Analytics setup
- [ ] First test deal posted

**Day 4-5:**
- [ ] Homepage design
- [ ] Research 20+ deals
- [ ] Post first batch of deals

**Day 6-7:**
- [ ] Write 2-3 blog posts
- [ ] Final testing
- [ ] Soft launch!

---

## 🆘 Troubleshooting

### Common Hostinger Issues

**Can't find WordPress installer:**
- Look for "Auto Installer" or "Website" section
- OR: hPanel → Websites → Manage → Auto Installer

**WordPress not loading:**
- Check DNS propagation (can take 24 hours)
- Try: https://BeanzNeez.com instead of http://
- Clear browser cache

**Can't login to wp-admin:**
- URL is: https://BeanzNeez.com/wp-admin
- NOT: https://BeanzNeez.com/wordpress/wp-admin
- Check username (it's case-sensitive)

**Email not working:**
- Hostinger requires email setup separately
- Consider using Gmail for business emails initially
- OR: Set up email in hPanel → Email section

---

## 🎯 Next Steps

**What to do RIGHT NOW:**

1. [ ] Install WordPress on Hostinger (follow Step 1 above)
2. [ ] Log into WordPress dashboard
3. [ ] Configure basic settings (follow Step 2)
4. [ ] Enable SSL (follow Step 3)

**Then tell me:**
- "WordPress is installed and I can access the dashboard"
- Any issues you're running into

**I can help you with:**
- WordPress installation walkthrough
- Plugin configuration
- Homepage design
- First deals to post
- Amazon Associates application
- Anything else!

---

**Let's get your site live! What step are you on?** 🚀
