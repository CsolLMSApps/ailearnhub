#!/bin/bash
# DEPLOY_FIX_V3.sh — Robust deploy that avoids bracket-path git add issue

set -e
cd /c/Users/Macbook/Downloads/ailearnhub-main

echo ""
echo "=============================================="
echo "  Deploying quiz fix (v3)"
echo "=============================================="
echo ""

git config --global user.name "Srikanth Merianda"
git config --global user.email "srikanth@ctekksolutions.net"

echo "--- Current git status ---"
git status

echo ""
echo "--- Checking what changed vs HEAD ---"
git diff HEAD --name-only || true

echo ""
echo "--- Staging all tracked + new files ---"
# Use -A to avoid bracket-path issues with [slug] and [number]
git add -A

echo ""
echo "--- Staged files ---"
git diff --cached --name-only

echo ""
# Only commit if there's something staged
STAGED=$(git diff --cached --name-only | wc -l)

if [ "$STAGED" -gt "0" ]; then
  git commit -m "fix: adminFetch (plain fetch) replaces createClient — fixes module crash"
  echo ""
  echo "Pushing to GitHub..."
  git push origin main
  echo ""
  echo "=============================================="
  echo "  DEPLOYED — Vercel rebuilds in ~2 min"
  echo "=============================================="
else
  echo "Nothing to commit — checking if HEAD already has the fix..."
  echo ""
  echo "admin.ts content at HEAD:"
  git show HEAD:lib/supabase/admin.ts 2>/dev/null | head -20 || echo "  File not in HEAD"
  echo ""
  echo "If admin.ts shows createClient above, the file edits did not reach git."
  echo "Try running: git push origin main --force"
  echo "Or check that the files were saved correctly."
fi
