#!/bin/bash
# DEPLOY_CERTIFICATE_FIX.sh
# Fixes certificate not showing: uses adminUpsert (service role key) to
# bypass RLS on the certificates table. Also extends adminFetch with POST support.

set -e
cd /c/Users/Macbook/Downloads/ailearnhub-main

echo ""
echo "=============================================="
echo "  Deploying certificate fix"
echo "=============================================="
echo ""

git config --global user.name "Srikanth Merianda"
git config --global user.email "srikanth@ctekksolutions.net"

git add -A

echo "Staged files:"
git diff --cached --name-only

STAGED=$(git diff --cached --name-only | wc -l)

if [ "$STAGED" -gt "0" ]; then
  git commit -m "fix: use adminUpsert for certificate creation — bypasses RLS"
  git push origin main
  echo ""
  echo "=============================================="
  echo "  DEPLOYED — Vercel rebuilds in ~2 min"
  echo "=============================================="
  echo ""
  echo "After deploy: visit /learn/prompt-engineering-mastery"
  echo "The certificate card + Download button will appear in the green banner."
else
  echo "Nothing to stage. Git status:"
  git status
fi
