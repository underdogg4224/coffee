# Complete Beginner's Guide to WordPress Setup
## For Someone Who's Never Used WordPress Before

**Don't worry!** This is easier than you think. You'll be done in about 30 minutes.

---

## 🎯 What We're Going to Do

1. Log into Hostinger
2. Click a button to install WordPress (literally one click)
3. Set up your username and password
4. Log into your new website
5. Make a few basic settings changes

That's it! Let's go step-by-step.

---

## Step 1: Log Into Hostinger (5 minutes)

### What to do:

1. **Open your web browser** (Chrome, Firefox, Safari, whatever you use)

2. **Go to:** `https://hpanel.hostinger.com`
   - This is Hostinger's control panel

3. **Enter your login info:**
   - Email: (the email you used to sign up)
   - Password: (your Hostinger password)
   - Click "Log In"

4. **You should see the Hostinger dashboard**
   - It looks like a control panel with lots of options
   - Don't be overwhelmed - we only need ONE button

### ✅ Success looks like:
- You're logged in
- You see "Websites" or "Hosting" somewhere on the screen

### ❌ Problem?
- **Forgot password?** Click "Forgot Password" and check your email
- **Can't find hpanel.hostinger.com?** Try going to regular Hostinger.com and clicking "Login" in the top right

---

## Step 2: Find the WordPress Installer (2 minutes)

### What to do:

**In the Hostinger dashboard, look for ONE of these:**

**Option A: "Auto Installer" button**
- Usually in the left sidebar
- Might have a WordPress icon
- Click it

**Option B: "Website" section**
- Look for a section called "Website" or "Websites"
- Click on it
- Look for "Install WordPress" or "Auto Installer"

**Option C: Your domain name (BeanzNeez.com)**
- Find where it shows "BeanzNeez.com"
- Click "Manage" next to it
- Look for "Install WordPress" or "Auto Installer"

**Option D: Search bar**
- Some Hostinger dashboards have a search bar at the top
- Type "WordPress" and it should show you the installer

### 💡 What you're looking for:
A button or link that says something like:
- "Install WordPress"
- "Auto Installer"
- "Website Builder"
- "One-Click Installer"

### ✅ Success looks like:
- You clicked something WordPress-related
- A page opens asking you to configure WordPress settings

### ❌ Still can't find it?
**Take a screenshot of your Hostinger dashboard and tell me what you see. I'll point you exactly where to click.**

---

## Step 3: Install WordPress (5 minutes)

### What to do:

Once you found the WordPress installer, you'll see a form with several fields. Here's what to enter:

---

### 📋 WordPress Installation Form

**1. Choose Domain:**
```
Select: BeanzNeez.com (from dropdown)
```
- If it asks about "subdomain" or "directory", leave it BLANK
- We want WordPress installed at the main domain (BeanzNeez.com), not a subfolder

---

**2. Site Title:**
```
Enter: BeanzNeez
```
- This is your website name
- You can change this later, no stress

---

**3. Site Description / Tagline:**
```
Enter: Fresh Coffee Deals from Specialty Roasters
```
- Short description of your site
- Also changeable later

---

**4. Admin Username:**
```
⚠️ IMPORTANT: Do NOT use "admin"
Choose something unique, like: beanzneez_admin OR your_first_name
```
- This is your login username
- Using "admin" makes you vulnerable to hackers
- Pick something memorable but not obvious
- **Write this down!**

---

**5. Admin Password:**
```
Use a STRONG password - at least 12 characters
Include: uppercase, lowercase, numbers, symbols

Example format: Coffee2024!BeanzNeez
Or use a password generator (Google "password generator")

⚠️ WRITE THIS DOWN SOMEWHERE SAFE!
```
- You'll need this to log in
- Make it strong (you only type it occasionally)

---

**6. Admin Email:**
```
Enter: your real email address
```
- Where WordPress sends notifications
- Where you reset password if you forget
- Make sure you can access this email!

---

**7. Language:**
```
Select: English (or your preferred language)
```

---

**8. Select Plugins (if asked):**
```
UNCHECK everything for now
We'll add plugins later
```
- Don't install WooCommerce (we're not selling products)
- Don't install Jetpack (not needed)
- Keep it simple for now

---

**9. Advanced Options (if shown):**
```
Database Name: (leave default)
Table Prefix: (leave default as "wp_")
```
- Don't touch these unless you know what you're doing
- Defaults are fine

---

### ✅ Ready to install?

**Click the button that says:**
- "Install" OR
- "Install WordPress" OR
- "Complete Installation"

**Wait 1-3 minutes** while it installs. You'll see:
- A progress bar, OR
- A spinning wheel, OR
- A message saying "Installing..."

### ✅ Success looks like:
You see a screen that says:
- "WordPress installed successfully!" OR
- "Installation complete!" OR
- Shows you your login URL

**You should get TWO important URLs:**

1. **Your website:** `https://BeanzNeez.com`
2. **Your admin area:** `https://BeanzNeez.com/wp-admin`

**Write these down!**

### ❌ Error messages?
- "Domain not found" → Make sure you selected BeanzNeez.com (not a subdomain)
- "Installation failed" → Try again, or tell me the exact error message
- Takes forever → Wait 5 minutes, then refresh. Might be slow servers.

---

## Step 4: Log Into WordPress (3 minutes)

### What to do:

1. **Open a new browser tab**

2. **Go to:** `https://BeanzNeez.com/wp-admin`
   - This is your WordPress login page
   - Bookmark this! You'll use it every time

3. **Enter your credentials:**
   - Username: (the admin username you just created)
   - Password: (the password you just created)
   - Check "Remember Me" (optional, but convenient)
   - Click "Log In"

### ✅ Success looks like:
- You're inside WordPress!
- You see a dashboard with a menu on the left side
- Menu items like: Dashboard, Posts, Media, Pages, Comments, Appearance, Plugins, Users, Tools, Settings

**Welcome to WordPress!** 🎉

### ❌ Can't log in?
- **Wrong password?** Click "Lost your password?" to reset
- **Page not found?** Try `https://BeanzNeez.com/wp-login.php` instead
- **Asks for install again?** WordPress might not have installed correctly - tell me what happened

---

## Step 5: Basic WordPress Settings (10 minutes)

### Now that you're logged in, let's set up 5 important things:

---

### A. Set Your Site Title & Tagline

**Where:** Left sidebar → **Settings** → **General**

**Change these:**
```
Site Title: BeanzNeez
Tagline: Fresh Coffee Deals from 1,000+ Specialty Roasters

WordPress Address (URL): https://BeanzNeez.com
Site Address (URL): https://BeanzNeez.com

Email Address: (your email - should be filled in)
Timezone: (your timezone)
Date Format: (pick one you like)
Time Format: (pick one you like)
```

**Scroll down and click: "Save Changes"**

---

### B. Set Permalinks (IMPORTANT!)

**Where:** Left sidebar → **Settings** → **Permalinks**

**What are permalinks?** They're your URL structure. Right now your pages might look like:
- `BeanzNeez.com/?p=123` ❌ (ugly, bad for SEO)

We want them to look like:
- `BeanzNeez.com/stumptown-coffee-deal` ✅ (clean, good for SEO)

**What to do:**
- Click the radio button next to **"Post name"**
- It should show: `/%postname%/`
- Scroll down and click: **"Save Changes"**

**✅ Done!** Your URLs will now be pretty and SEO-friendly.

---

### C. Make Sure SSL is Working (HTTPS)

**Where:** Look at your address bar. It should show:
```
✅ https://BeanzNeez.com (with a lock icon)
```

**If it shows HTTP (no 'S'):**

1. Go back to Hostinger dashboard
2. Find "SSL" section
3. Make sure SSL is enabled for BeanzNeez.com
4. Wait 10-15 minutes for it to activate

**OR install this plugin:**
1. In WordPress: **Plugins** → **Add New**
2. Search: "Really Simple SSL"
3. Click "Install Now"
4. Click "Activate"
5. Click "Activate SSL" when prompted

**✅ Success:** Your site shows HTTPS with a lock icon

---

### D. Set Your Homepage

**Where:** Left sidebar → **Settings** → **Reading**

**Current situation:** Right now your homepage probably shows blog posts (default)

**What to do:**
```
Your homepage displays:
○ Your latest posts (default)
● A static page ← Select this

Homepage: (we'll create this page next, leave for now)
Posts page: (leave blank for now)
```

**Scroll down and click: "Save Changes"**

**Note:** We'll actually create the homepage in the next step. This just prepares WordPress for it.

---

### E. Disable Comments (Optional but Recommended)

**Where:** Left sidebar → **Settings** → **Discussion**

**Why?** Deal sites don't need blog-style comments (we'll add deal ratings later)

**What to do:**
```
UNCHECK: "Allow people to submit comments on new posts"
```

**Scroll down and click: "Save Changes"**

---

## Step 6: Quick Tour of WordPress (5 minutes)

### Let's understand what you're looking at:

**Left Sidebar Menu (This is where you'll spend most of your time):**

---

**Dashboard** 📊
- Your homepage when logged in
- Shows quick stats
- You won't use this much

---

**Posts** 📝
- Blog posts go here
- We'll write coffee articles here
- "All Posts" = see all blog posts
- "Add New" = write a new post

---

**Media** 🖼️
- Your image library
- Upload photos, logos here
- Used in posts and pages

---

**Pages** 📄
- Static pages (About, Contact, etc.)
- Different from Posts
- "All Pages" = see all pages
- "Add New" = create new page

---

**Comments** 💬
- We disabled these
- Can ignore this section

---

**Appearance** 🎨
- **Themes** = change your site design
- **Customize** = edit colors, fonts, layout
- **Widgets** = sidebar elements
- **Menus** = navigation menus
- This is where we'll make it look pretty!

---

**Plugins** 🔌
- Add features to WordPress
- Like apps on your phone
- "Installed Plugins" = what you have
- "Add New" = install more plugins

---

**Users** 👥
- Manage who can log in
- For now, just you
- Later: maybe hire someone to post deals

---

**Tools** 🛠️
- Import/export content
- Rarely used

---

**Settings** ⚙️
- Where we just were
- General, Writing, Reading, etc.
- Important but you won't visit often

---

## ✅ Congratulations! You Just Set Up WordPress!

### What you've accomplished:
- ✅ Installed WordPress on your domain
- ✅ Logged into your dashboard
- ✅ Set up permalinks (SEO-friendly URLs)
- ✅ Configured basic settings
- ✅ Learned the WordPress interface

### What's next?

**Your site is live, but it's empty.** Time to make it beautiful!

---

## 🚀 Next Steps (In Order)

### Tomorrow: Install Theme & Plugins (1 hour)
1. Install Astra theme (makes it look professional)
2. Install 5 essential plugins:
   - Yoast SEO (search engine optimization)
   - WP Coupons & Deals (for posting deals)
   - ThirstyAffiliates (affiliate link management)
   - MailChimp for WordPress (email signups)
   - MonsterInsights (Google Analytics)

**I'll walk you through each one when you're ready!**

### Day 3: Create Core Pages (1 hour)
- Homepage
- About page
- Contact page
- Affiliate Disclosure (required!)
- Privacy Policy

**I have templates ready for you!**

### Day 4-5: Post Your First Deals (2 hours)
- I'll show you where to find deals
- How to post them in WordPress
- How to add your affiliate links

### Week 2: Launch! 🎉

---

## 🆘 Common Questions

**Q: Can I break WordPress?**
A: Not really! WordPress has built-in backups and it's hard to permanently mess things up. You can always reinstall if needed.

**Q: Do I need to know code?**
A: Nope! Everything we're doing is point-and-click. No coding required.

**Q: How do I make changes go live?**
A: Whenever you click "Publish" on a post or page, it goes live immediately. Be careful!

**Q: Can I preview before publishing?**
A: Yes! Click "Preview" instead of "Publish" to see what it looks like first.

**Q: What if I forget my password?**
A: Go to BeanzNeez.com/wp-admin, click "Lost your password?" and follow the email instructions.

**Q: Can I work on the site without it being public?**
A: Sort of. You can set it to "private" in Settings → Reading → "Discourage search engines" (we'll uncheck this at launch).

**Q: How do I log out?**
A: Top right corner → Hover over your name → "Log Out"

---

## 📞 I'm Here to Help!

**Tell me when you're at one of these stages:**

1. ✅ "WordPress is installed!" → I'll help you install the theme
2. ✅ "I'm logged into WordPress!" → I'll give you a quick tour
3. ❌ "I'm stuck at [specific step]" → I'll troubleshoot with you
4. ❓ "I have a question about [something]" → Ask away!

**Don't feel dumb asking questions!** Everyone was a beginner once. I'm here to help you through every single step.

---

## 🎯 Your ONLY Job Right Now

**Just get WordPress installed and log in successfully.**

That's it. Don't worry about anything else yet.

Once you're logged in, tell me:
**"I'm in!"**

And I'll give you the next simple step.

---

**You've got this!** 💪☕

WordPress is used by 43% of all websites on the internet. If millions of people can figure it out, you definitely can.

Take it one step at a time, and let me know when you need help.
