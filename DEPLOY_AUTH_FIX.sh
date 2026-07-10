#!/bin/bash
# ============================================================
# AILearnHub — Auth Route Fix Deploy Script
# Fixes all /auth/login and /auth/signup 404 errors
# Routes are at /login and /signup (route group, no URL segment)
# ============================================================

set -e

PROJECT_DIR="/c/projects/ailearnhub"
SRC_DIR="/c/Users/Macbook/Downloads/ailearnhub-main"

echo "============================================================"
echo " AILearnHub — Auth Route Fix"
echo "============================================================"

if [ ! -d "$PROJECT_DIR" ]; then
  echo "ERROR: Project directory not found: $PROJECT_DIR"
  exit 1
fi

cd "$PROJECT_DIR"

# Validate git config
git config user.name "Srikanth Merianda"
git config user.email "srikanth@ctekksolutions.net"
echo "✅ Git identity: $(git config user.name) <$(git config user.email)>"

# Pull latest
git fetch origin main
git pull origin main
echo "✅ Up to date with origin/main"

# Backup files
echo ""
echo "📦 Backing up files..."
cp proxy.ts proxy.ts.bak2
cp components/Header.tsx components/Header.tsx.bak
cp "app/(auth)/login/page.tsx" "app/(auth)/login/page.tsx.bak"
cp "app/(auth)/signup/page.tsx" "app/(auth)/signup/page.tsx.bak"
cp app/dashboard/page.tsx app/dashboard/page.tsx.bak
cp app/sitemap.ts app/sitemap.ts.bak
cp "app/(marketing)/contact/page.tsx" "app/(marketing)/contact/page.tsx.bak"
echo "✅ Backups done"

# Apply fixes
echo ""
echo "🔧 Applying auth route fixes..."
cp "$SRC_DIR/proxy.ts" proxy.ts
cp "$SRC_DIR/components/Header.tsx" components/Header.tsx
cp "$SRC_DIR/app/(auth)/login/page.tsx" "app/(auth)/login/page.tsx"
cp "$SRC_DIR/app/(auth)/signup/page.tsx" "app/(auth)/signup/page.tsx"
cp "$SRC_DIR/app/dashboard/page.tsx" app/dashboard/page.tsx
cp "$SRC_DIR/app/sitemap.ts" app/sitemap.ts
cp "$SRC_DIR/app/(marketing)/contact/page.tsx" "app/(marketing)/contact/page.tsx"
echo "✅ All 7 files updated"

# Build test
echo ""
echo "🏗️  Running npm run build..."
if npm run build; then
  echo "✅ Build passed!"
else
  echo "❌ Build FAILED — rolling back..."
  cp proxy.ts.bak2 proxy.ts
  cp components/Header.tsx.bak components/Header.tsx
  cp "app/(auth)/login/page.tsx.bak" "app/(auth)/login/page.tsx"
  cp "app/(auth)/signup/page.tsx.bak" "app/(auth)/signup/page.tsx"
  cp app/dashboard/page.tsx.bak app/dashboard/page.tsx
  cp app/sitemap.ts.bak app/sitemap.ts
  cp "app/(marketing)/contact/page.tsx.bak" "app/(marketing)/contact/page.tsx"
  echo "✅ Rollback complete."
  exit 1
fi

# Commit and push
echo ""
echo "🚀 Committing and pushing..."
git add proxy.ts \
  components/Header.tsx \
  "app/(auth)/login/page.tsx" \
  "app/(auth)/signup/page.tsx" \
  app/dashboard/page.tsx \
  app/sitemap.ts \
  "app/(marketing)/contact/page.tsx"

git commit -m "fix: correct all auth routes from /auth/login to /login

The (auth) folder is a Next.js route GROUP — parentheses mean it does
NOT add a URL segment. So the actual routes are:
  /login  (not /auth/login)
  /signup (not /auth/signup)

Fixed /auth/login → /login and /auth/signup → /signup in:
- proxy.ts (middleware redirect)
- components/Header.tsx (nav links)
- app/(auth)/login/page.tsx (sign up link)
- app/(auth)/signup/page.tsx (sign in link)
- app/dashboard/page.tsx (auth guard redirect)
- app/sitemap.ts (sitemap entries)
- app/(marketing)/contact/page.tsx (nav links)"

git push origin main

echo ""
echo "============================================================"
echo " ✅ AUTH FIX DEPLOYED"
echo "============================================================"
echo ""
echo "Vercel will auto-deploy in ~2 minutes. Then verify:"
echo "  https://ailearnhub.io/login    → login form renders"
echo "  https://ailearnhub.io/signup   → signup form renders"
echo "  https://ailearnhub.io/dashboard → redirects to /login"
echo "  Header Login/Sign Up buttons   → work correctly"
