#!/bin/bash
# DEPLOY_CERTIFICATE.sh
# Fixes:
#   1. Code block dark background removed (light gray instead)
#   2. Auto-generates certificate when course is 100% complete
#   3. Adds /learn/[slug]/certificate page with print/download button

set -e
cd /c/Users/Macbook/Downloads/ailearnhub-main

echo ""
echo "=============================================="
echo "  Deploying certificate + code block fixes"
echo "=============================================="
echo ""

git config --global user.name "Srikanth Merianda"
git config --global user.email "srikanth@ctekksolutions.net"

git add "app/learn/[slug]/page.tsx"
git add "app/learn/[slug]/module/[number]/page.tsx"
git add "app/learn/[slug]/certificate/page.tsx"
git add "app/api/quiz/submit/route.ts"

echo "Files staged:"
git diff --cached --name-only

git commit -m "fix: create progress on first quiz pass, auto-generate certificate, certificate page"

echo ""
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=============================================="
echo "  DEPLOYED"
echo "=============================================="
echo ""
echo "Vercel will auto-deploy in ~2 minutes. Then verify:"
echo "  Code blocks    → light gray background, text readable"
echo "  Complete course → certificate auto-generates + appears"
echo "  /learn/[slug]/certificate → printable certificate page"
echo ""
