# AI LEARN HUB - COMPLETE SETUP GUIDE
## Step-by-Step Instructions for Deployment

---

## 📋 PREREQUISITES CHECKLIST

Before starting, ensure you have:
- [ ] Node.js 18+ installed (guide below)
- [ ] Git installed
- [ ] Accounts created:
  - [ ] Supabase (supabase.com)
  - [ ] Stripe (stripe.com) - Already done ✓
  - [ ] Resend (resend.com) - Already done ✓
  - [ ] Vercel (vercel.com)
  - [ ] GitHub (github.com)

---

## 🟢 STEP 1: INSTALL NODE.JS (Windows + Git Bash)

### Download & Install:
1. Go to: https://nodejs.org/
2. Download **LTS version** (v20.x or v18.x)
3. Run installer, click "Next" through all steps
4. ✅ Check "Add to PATH" (should be checked by default)
5. Click "Install"

### Verify Installation:
Open Git Bash and run:
```bash
node --version
# Should show: v20.x.x or v18.x.x

npm --version
# Should show: 10.x.x or 9.x.x
```

If both show versions, you're ready! ✅

---

## 🟦 STEP 2: SETUP SUPABASE PROJECT

### 2.1 Create New Project

1. Go to: https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in details:
   - **Name:** AI Learn Hub
   - **Database Password:** (Generate strong password - SAVE THIS!)
   - **Region:** US East (closest to your target audience)
   - **Pricing Plan:** Free (perfect for start)
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

### 2.2 Get API Keys

1. In your project, go to: **Settings** (⚙️ icon) → **API**
2. Copy and save these values:

```
Project URL: https://[YOUR-PROJECT-ID].supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (long string)
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (different long string)
```

⚠️ **IMPORTANT:** 
- `anon key` = Safe to use in browser
- `service_role key` = NEVER expose publicly (only use in server code)

### 2.3 Run Database Schema

1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the file: `/home/claude/ailearnhub/database/schema.sql`
4. Copy ALL content from that file
5. Paste into SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

### 2.4 Create Storage Buckets

1. Go to **Storage** (left sidebar)
2. Click **"Create bucket"**

**Bucket 1: Certificates**
- Name: `certificates`
- Public: **OFF** (unchecked)
- Click "Create bucket"

**Bucket 2: Course Materials**
- Name: `course-materials`
- Public: **ON** (checked)
- Click "Create bucket"

### 2.5 Set Storage Policies

For `certificates` bucket:
1. Click the bucket name
2. Go to "Policies" tab
3. Click "New Policy"
4. Select "Custom" → paste:

```sql
CREATE POLICY "Users can view own certificates"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'certificates' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

For `course-materials` bucket:
1. Click the bucket
2. Policies tab → "New Policy"
3. Select "Public Access" → "Allow public read access"

---

## 🟧 STEP 3: SETUP STRIPE

### 3.1 Get API Keys

1. Go to: https://dashboard.stripe.com
2. Click **"Developers"** → **"API keys"**
3. Make sure you're in **TEST MODE** (toggle top-right)
4. Copy and save:

```
Publishable key: pk_test_...
Secret key: sk_test_...
```

### 3.2 Create Webhook Endpoint

We'll do this AFTER deploying to Vercel (Step 5)
For now, just note that you'll need:
- Webhook URL: `https://ailearnhub.io/api/stripe/webhook`
- Events to listen for: `checkout.session.completed`

### 3.3 Enable Stripe Tax (Optional but Recommended)

1. In Stripe Dashboard → **"Products"** → **"Tax"**
2. Click **"Enable Stripe Tax"**
3. Follow setup wizard (takes 2 minutes)

---

## 🟨 STEP 4: SETUP RESEND EMAIL

### 4.1 Add Domain

1. Go to: https://resend.com/domains
2. Click **"Add Domain"**
3. Enter: `ailearnhub.io`
4. You'll see DNS records to add

### 4.2 Add DNS Records to Dynadot

**Go to Dynadot → Your Domain → DNS Settings**

Add these 3 TXT records (Resend will show exact values):

**Record 1: SPF**
```
Type: TXT
Name: @
Value: v=spf1 include:amazonses.com ~all
TTL: 3600
```

**Record 2: DKIM**
```
Type: TXT  
Name: resend._domainkey
Value: [Resend will provide this - looks like: p=MIGfMA0GCSqGSIb3...]
TTL: 3600
```

**Record 3: Domain Verification**
```
Type: TXT
Name: @
Value: resend-domain-verify=[unique-code]
TTL: 3600
```

**Record 4: DMARC (Recommended)**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:support@ailearnhub.io
TTL: 3600
```

### 4.3 Verify Domain

1. Wait 10-30 minutes for DNS propagation
2. In Resend dashboard, click **"Verify"**
3. Once verified, you'll see green checkmark ✅

### 4.4 Get API Key

1. Go to: **API Keys** in Resend
2. Click **"Create API Key"**
3. Name: "AI Learn Hub Production"
4. Copy and save: `re_...`

---

## 🟪 STEP 5: DEPLOY TO VERCEL

### 5.1 Create GitHub Repository

Since you have GitHub account:

1. Go to: https://github.com/new
2. Repository name: `ailearnhub`
3. Description: "AI Learn Hub - Course Platform"
4. Visibility: **Private** (recommended)
5. Click **"Create repository"**

### 5.2 Push Code to GitHub

In your local terminal (Git Bash):

```bash
cd /path/to/ailearnhub
git init
git add .
git commit -m "Initial commit - AI Learn Hub"
git branch -M main
git remote add origin https://github.com/[YOUR-USERNAME]/ailearnhub.git
git push -u origin main
```

### 5.3 Connect to Vercel

1. Go to: https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your `ailearnhub` repo
5. **Framework Preset:** Next.js (auto-detected)
6. Click **"Deploy"** (don't add env vars yet)
7. Wait for first deployment (will fail - that's OK)

### 5.4 Add Environment Variables

1. In Vercel project → **"Settings"** → **"Environment Variables"**
2. Add these one by one (click "Add" after each):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (your anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (your service role key)

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=[leave empty for now - will add after webhook setup]

# Resend
RESEND_API_KEY=re_...

# Site Config
NEXT_PUBLIC_SITE_URL=https://ailearnhub.io
NEXT_PUBLIC_SITE_NAME=AI Learn Hub
NEXT_PUBLIC_SUPPORT_EMAIL=support@ailearnhub.io
```

⚠️ **Important:** 
- For Production, Development, and Preview environments: Check ALL three
- Click "Save" after adding all variables

### 5.5 Redeploy

1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment → **"Redeploy"**
3. Wait for success ✅

---

## 🟫 STEP 6: CONFIGURE DOMAIN (Dynadot → Vercel)

### 6.1 Add Domain in Vercel

1. In Vercel project → **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter: `ailearnhub.io`
4. Click **"Add"**
5. Vercel will show you DNS records to add

### 6.2 Update DNS in Dynadot

Go to: Dynadot → Domain Settings → DNS

**Delete any existing A/CNAME records for @**

Add these records:

**Record 1: Root domain**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Record 2: WWW subdomain**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Record 3: Redirect ailearnhub.tech**
(Do this later after .io works)

### 6.3 Verify Domain

1. Wait 10-30 minutes for DNS propagation
2. In Vercel, you'll see checkmark when domain is verified ✅
3. Vercel automatically provisions SSL certificate

---

## ⚙️ STEP 7: FINALIZE STRIPE WEBHOOK

Now that site is live, complete webhook setup:

### 7.1 Create Webhook in Stripe

1. Stripe Dashboard → **"Developers"** → **"Webhooks"**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://ailearnhub.io/api/stripe/webhook`
4. Description: "AI Learn Hub Purchase Handler"
5. Select events to listen to:
   - `checkout.session.completed`
   - `charge.refunded` (for refunds)
6. Click **"Add endpoint"**

### 7.2 Get Webhook Secret

1. Click on the webhook you just created
2. In "Signing secret" section, click **"Reveal"**
3. Copy the value: `whsec_...`

### 7.3 Add to Vercel

1. Vercel → Settings → Environment Variables
2. Find `STRIPE_WEBHOOK_SECRET` (or add new)
3. Value: `whsec_...` (paste what you copied)
4. Save
5. Redeploy project

### 7.4 Test Webhook

1. In Stripe webhook page, click **"Send test webhook"**
2. Select `checkout.session.completed`
3. Click **"Send test webhook"**
4. You should see "200 OK" response ✅

---

## 💻 STEP 8: LOCAL DEVELOPMENT SETUP

### 8.1 Clone Repository

```bash
# Open Git Bash
cd /c/Users/[YourName]/Documents
git clone https://github.com/[YOUR-USERNAME]/ailearnhub.git
cd ailearnhub
```

### 8.2 Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 8.3 Create .env.local File

Create file: `.env.local` in project root (copy from `.env.local.example`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe)

# Resend
RESEND_API_KEY=re_...

# Site Config
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=AI Learn Hub
NEXT_PUBLIC_SUPPORT_EMAIL=support@ailearnhub.io
```

### 8.4 Run Development Server

```bash
npm run dev
```

Open browser: http://localhost:3000

You should see the homepage! 🎉

---

## 🧪 STEP 9: TEST EVERYTHING

### 9.1 Test Authentication

1. Go to: https://ailearnhub.io/auth/signup
2. Create test account
3. Check email for confirmation (if email auth enabled)
4. Should redirect to dashboard

### 9.2 Test Course Purchase

1. Browse to course page
2. Click "Enroll Now"
3. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
4. Complete payment
5. Should redirect to dashboard
6. Course should appear in "My Courses"
7. Check Stripe dashboard → Payments (should see test payment)
8. Check Supabase → Table Editor → purchases (should see record)

### 9.3 Test Course Access

1. From dashboard, click "Continue Learning"
2. Should see Module 1 content
3. Read through module
4. Click "Mark as Complete"
5. Take quiz
6. Pass quiz (70%+)
7. Should unlock Module 2

### 9.4 Test Certificate Generation

1. Complete all modules + quizzes for a course
2. Certificate should auto-generate
3. Download PDF
4. Verify it has:
   - Your name
   - Course title
   - Unique certificate number
   - Issue date

---

## 🔧 TROUBLESHOOTING

### Issue: Can't login / "Invalid credentials"
**Fix:** Check Supabase → Authentication → Settings
- Confirm email auth is enabled
- Check email templates are configured

### Issue: Stripe payment fails
**Fix:** 
1. Verify webhook endpoint is https://ailearnhub.io/api/stripe/webhook
2. Check webhook secret matches in Vercel env vars
3. Test mode enabled in Stripe

### Issue: Course content not loading
**Fix:** 
1. Check RLS policies in Supabase
2. Verify purchase record exists for user + course
3. Check browser console for errors

### Issue: Certificate won't generate
**Fix:**
1. Verify all quizzes passed (≥70%)
2. Check completion_percentage = 100 in progress table
3. Check Supabase storage bucket permissions

---

## 📊 GOING LIVE (Switch to Production)

### When you're ready for real payments:

**1. Stripe:**
- Toggle to **LIVE MODE**
- Create new webhook for live: https://ailearnhub.io/api/stripe/webhook
- Copy LIVE keys (pk_live_..., sk_live_..., whsec_...)
- Update Vercel environment variables

**2. Supabase:**
- Already in production mode ✅

**3. Resend:**
- Already verified for production sending ✅

**4. Remove Test Data:**
- Delete test purchases from Supabase
- Delete test users if needed

**5. Launch!** 🚀

---

## 📈 MONITORING

### Vercel:
- Dashboard → Analytics (page views, performance)
- Logs → Runtime Logs (errors)

### Stripe:
- Dashboard → Payments (revenue tracking)
- Webhooks → Events (delivery status)

### Supabase:
- Database → Table Editor (browse data)
- Logs → Postgres Logs (query performance)
- Auth → Users (user signups)

---

## 🆘 NEED HELP?

**Common Commands:**

```bash
# Start local dev server
npm run dev

# Build for production (test locally)
npm run build
npm start

# Check for errors
npm run lint

# Update dependencies
npm update

# Clear cache (if issues)
rm -rf .next node_modules
npm install --legacy-peer-deps
```

**Resources:**
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- Vercel Docs: https://vercel.com/docs

---

## ✅ SETUP COMPLETE!

Your AI Learn Hub is now:
- ✅ Database configured (Supabase)
- ✅ Payments working (Stripe)
- ✅ Emails sending (Resend)
- ✅ Deployed online (Vercel)
- ✅ Domain connected (ailearnhub.io)
- ✅ Local development ready

**Next Steps:**
1. Add your bio and testimonials
2. Create first marketing campaign
3. Monitor first users
4. Collect feedback
5. Iterate and improve!

🎉 **Congratulations on launching your SaaS!**
