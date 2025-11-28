# 🚀 AI LEARN HUB - QUICK START GUIDE

## ⚡ GET RUNNING IN 30 MINUTES

### STEP 1: INSTALL NODE.JS (Windows)

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Click "Download LTS" (Long Term Support)
   - Run the installer
   - Check boxes: "Automatically install necessary tools"
   - Click through installer with defaults

2. **Verify Installation (Git Bash):**
```bash
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10.x.x or higher
```

---

### STEP 2: CLONE & INSTALL

```bash
# Navigate to your projects folder
cd ~/Documents/Projects  # or wherever you want

# Your repo is already at:
cd ailearnhub  # (if you're already in the repo)

# Install all dependencies (takes 2-3 minutes)
npm install
```

**Expected output:** `added 300+ packages`

---

### STEP 3: SET UP SUPABASE

#### 3a. Create Project

1. Go to: https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name:** `ailearnhub-prod`
   - **Database Password:** (Generate strong one, SAVE IT!)
   - **Region:** `East US (North Virginia)`
   - **Pricing:** Free
6. Click "Create new project" (takes ~2 minutes)

#### 3b. Get API Keys

1. In Supabase dashboard, click "Settings" (gear icon, bottom left)
2. Click "API"
3. You'll see three keys - COPY THESE:
   - **Project URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public:** `eyJhbGciOi...` (long string)
   - **service_role:** `eyJhbGciOi...` (different long string)

#### 3c. Create Database Tables

1. In Supabase, click "SQL Editor" (left sidebar)
2. Click "+ New query"
3. Open the file: `database/schema.sql` from this project
4. Copy ENTIRE contents
5. Paste into Supabase SQL Editor
6. Click "RUN" (bottom right)
7. Wait ~10 seconds
8. You should see: "Success. No rows returned"

✅ **Verify:** Click "Table Editor" - you should see 7 tables:
   - courses
   - course_modules
   - quizzes
   - purchases
   - progress
   - quiz_results
   - certificates

---

### STEP 4: SET UP STRIPE

#### 4a. Get Test Keys

1. Go to: https://dashboard.stripe.com
2. Sign in (or create account if needed)
3. **IMPORTANT:** Toggle to "Test mode" (top right, should see orange "TEST DATA" banner)
4. Click "Developers" (top right)
5. Click "API keys"
6. Copy these TWO keys:
   - **Publishable key:** `pk_test_51...`
   - **Secret key:** Click "Reveal" → `sk_test_51...`

#### 4b. Webhook Secret (Do This Later)

We'll set this up AFTER first deployment. For now, use placeholder:
- `whsec_placeholder`

---

### STEP 5: SET UP RESEND

1. Go to: https://resend.com
2. Sign up (free account)
3. Click "API Keys" (left sidebar)
4. Click "Create API Key"
   - **Name:** `ailearnhub-prod`
   - **Permission:** Full Access
5. Copy the key: `re_xxxxxxxxxxxx`
6. **Domain Setup (Skip for now):**
   - We'll verify noreply@ailearnhub.io later
   - For testing, Resend provides sandbox: onboarding@resend.dev

---

### STEP 6: ENVIRONMENT VARIABLES

1. In project root, copy the example file:

```bash
cp .env.local.example .env.local
```

2. Open `.env.local` in text editor (VS Code, Notepad++, etc.)

3. Fill in your credentials:

```env
# SUPABASE (from Step 3b)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# STRIPE (from Step 4a)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_placeholder

# RESEND (from Step 5)
RESEND_API_KEY=re_...

# SITE CONFIG (keep as-is for local dev)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=AI Learn Hub
NEXT_PUBLIC_SUPPORT_EMAIL=support@ailearnhub.io
```

4. **SAVE THE FILE** (Ctrl+S)

---

### STEP 7: RUN LOCALLY

```bash
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000
- Local:        http://localhost:3000
```

**Open browser:** http://localhost:3000

✅ **You should see:** Homepage with "AI Learn Hub" logo

---

### STEP 8: TEST AUTHENTICATION

1. Click "Sign Up" (top right)
2. Create account:
   - Name: Your name
   - Email: your-email@gmail.com
   - Password: TestPassword123!
3. Click "Create Account"
4. Check your email (might be in spam)
5. Click confirmation link
6. You should be redirected to Dashboard

**Troubleshooting:**
- If email doesn't arrive, check Supabase > Authentication > Users
- Your user should appear there
- Click on user → "Send Magic Link" to verify manually

---

### STEP 9: POPULATE COURSE CONTENT

I've prepared the course content. Run this command:

```bash
# This will be provided in the next file
npm run seed:courses
```

This will:
✅ Insert course modules into database  
✅ Create quiz questions  
✅ Populate markdown content files

---

### STEP 10: TEST PURCHASE FLOW

1. Go to http://localhost:3000/marketing/courses
2. Click "ChatGPT Mastery"
3. Click "Enroll Now" ($19)
4. Use Stripe test card:
   - **Card:** `4242 4242 4242 4242`
   - **Expiry:** `12/34` (any future date)
   - **CVC:** `123`
   - **ZIP:** `12345`
5. Click "Pay"
6. You should be redirected to Dashboard
7. Course should appear in "My Courses"
8. Click "Continue Learning"
9. ✅ **SUCCESS!** You should see Module 1 content

---

## 🚀 DEPLOY TO PRODUCTION

### STEP 11: PUSH TO GITHUB

```bash
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Initial AI Learn Hub build"

# Push to main branch
git push origin main
```

---

### STEP 12: DEPLOY TO VERCEL

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Find "ailearnhub" repo → "Import"
5. **Environment Variables:**
   - Click "Environment Variables"
   - Copy from your `.env.local` (all 9 variables)
   - Paste each one:
     - Name: `NEXT_PUBLIC_SUPABASE_URL`
     - Value: `https://xxx.supabase.co`
     - ✓ Production, ✓ Preview, ✓ Development
   - Repeat for all variables
6. Click "Deploy"
7. Wait ~3 minutes
8. Click "Visit" to see live site!

---

### STEP 13: CONFIGURE CUSTOM DOMAIN

#### 13a. In Vercel:

1. Go to project → "Settings" → "Domains"
2. Add domain: `ailearnhub.io`
3. Vercel will show DNS records you need

#### 13b. In Dynadot:

1. Log into Dynadot
2. Go to "My Domains" → "ailearnhub.io" → "DNS Settings"
3. Set Name Servers to "Dynadot DNS"
4. Add these records:

```
Type: A
Host: @
IP Address: 76.76.21.21
TTL: 3600

Type: CNAME
Host: www
Points to: cname.vercel-dns.com
TTL: 3600
```

5. **Save changes**
6. Wait 10-30 minutes for propagation
7. Vercel will auto-detect and issue SSL certificate

✅ **Test:** Visit https://ailearnhub.io

---

### STEP 14: CONFIGURE STRIPE WEBHOOK (PRODUCTION)

1. Stripe Dashboard → "Developers" → "Webhooks"
2. Click "+ Add endpoint"
3. **Endpoint URL:** `https://ailearnhub.io/api/stripe/webhook`
4. **Events:** Select `checkout.session.completed`
5. Click "Add endpoint"
6. Click "Reveal" signing secret: `whsec_xxxxx`
7. Update Vercel environment variable:
   - `STRIPE_WEBHOOK_SECRET` = `whsec_xxxxx`
8. Redeploy: Vercel Dashboard → "Deployments" → "..." → "Redeploy"

---

### STEP 15: SWITCH TO LIVE MODE

1. **Stripe:** Toggle from "Test mode" to "Live mode"
2. Get NEW keys:
   - `pk_live_51...`
   - `sk_live_51...`
3. **Update Vercel env vars:**
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → Live key
   - `STRIPE_SECRET_KEY` → Live key
4. **Redeploy**

---

## ✅ YOU'RE LIVE!

### Post-Launch Checklist:

- [ ] Test real purchase with your credit card ($19)
- [ ] Verify confirmation email arrives
- [ ] Complete Module 1
- [ ] Take quiz
- [ ] Complete all modules
- [ ] Download certificate
- [ ] Request refund (test < 50% flow)
- [ ] Test on mobile device
- [ ] Share on LinkedIn
- [ ] Start first ad campaign

---

## 📞 SUPPORT

**Issues?**
1. Check browser console (F12)
2. Check Vercel logs: Dashboard → "Logs"
3. Check Supabase logs: "Logs" section
4. Email: support@ailearnhub.io

**Common Issues:**

**"Cannot connect to database"**
→ Check Supabase URL and keys in .env.local

**"Stripe checkout not working"**
→ Verify test mode keys, check webhook secret

**"Email not sending"**
→ Resend free tier: 100 emails/day, verify domain

---

## 🎉 CONGRATULATIONS!

You now have a fully functional AI course platform!

**Next Steps:**
1. Generate Course #2 content
2. Add 4 more courses (Week 2)
3. Launch Facebook Ads ($50/day)
4. Collect testimonials
5. Build email sequences
6. Scale to $5K/month!

**Let's go! 🚀**
