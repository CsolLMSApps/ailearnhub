# AI Learn Hub

> AI course marketplace platform built with Next.js 15, Supabase, Stripe, and Resend

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account
- Stripe account (test mode)
- Resend account

### 1. Install Node.js (Windows with Git Bash)

```bash
# Download Node.js from https://nodejs.org/
# Choose LTS version (20.x or higher)
# Run installer with default settings

# Verify installation in Git Bash:
node --version
npm --version
```

### 2. Clone Repository

```bash
git clone https://github.com/CsolLMSApps/ailearnhub.git
cd ailearnhub
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Supabase

1. Go to https://supabase.com
2. Create new project
3. Choose "US East" region
4. Copy Project URL and API keys
5. Go to SQL Editor
6. Copy and execute SQL from `database/schema.sql`

### 5. Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
# Supabase (from project settings)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx...

# Stripe (from dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx (get after webhook setup)

# Resend
RESEND_API_KEY=re_xxxxx

# Site Config
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=AI Learn Hub
NEXT_PUBLIC_SUPPORT_EMAIL=support@ailearnhub.io
```

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 📁 Project Structure

```
ailearnhub/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── marketing/         # Public marketing pages
│   ├── dashboard/         # User dashboard
│   ├── learn/             # Course viewer
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Auth forms
│   ├── course/           # Course components
│   └── quiz/             # Quiz components
├── lib/                  # Utility libraries
│   ├── supabase/        # Supabase clients
│   ├── stripe.ts        # Stripe integration
│   └── email.ts         # Email service
├── types/                # TypeScript types
├── content/              # Course content (markdown)
└── public/               # Static assets
```

## 🗄️ Database Setup

The complete SQL schema is in `database/schema.sql`. It includes:

- ✅ All table definitions
- ✅ Row Level Security policies
- ✅ Indexes for performance
- ✅ Foreign key constraints

Execute in Supabase SQL Editor.

## 💳 Stripe Setup

1. Create products in Stripe Dashboard:
   - ChatGPT Mastery ($19 early bird)
   - AI for Beginners ($19 early bird)

2. Set up webhook:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`
   - Get webhook secret and add to .env.local

## 📧 Resend Setup

1. Add domain in Resend dashboard
2. Add DNS records to Dynadot:
   - DKIM
   - SPF
   - DMARC
3. Verify domain
4. Get API key

## 🚀 Deployment (Vercel)

1. Push code to GitHub
2. Go to vercel.com
3. Import repository
4. Add environment variables
5. Deploy!

### Domain Configuration (Dynadot)

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

## 📚 Course Content

Courses are in `content/courses/`:
- `chatgpt-mastery/` - 7 modules
- `ai-for-beginners/` - 6 modules

Each module is a markdown file with frontmatter.

## 🧪 Testing

```bash
# Test authentication
# 1. Create account at /auth/signup
# 2. Login at /auth/login
# 3. Check dashboard access

# Test purchase flow (use Stripe test cards)
# Card: 4242 4242 4242 4242
# Expiry: Any future date
# CVC: Any 3 digits
```

## 📖 Documentation

- [Next.js 15](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Stripe](https://stripe.com/docs)
- [Resend](https://resend.com/docs)

## 🆘 Support

Questions? Email support@ailearnhub.io

## 📄 License

Proprietary - AI Learn Hub © 2024

