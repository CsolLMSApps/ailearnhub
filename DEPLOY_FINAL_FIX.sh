#!/bin/bash
# DEPLOY_FINAL_FIX.sh
# Root cause: onPass function prop passed from Server Component to Client Component
# crashes Next.js 15. Quiz was null before (RLS blocked it), so it never fired.
# Now adminFetch returns the quiz, the prop is passed, and the server crashes.
# Fix: remove onPass entirely — QuizComponent now calls router.refresh() internally.

set -e
cd /c/Users/Macbook/Downloads/ailearnhub-main

echo ""
echo "=============================================="
echo "  FINAL FIX — removing onPass server→client prop"
echo "=============================================="
echo ""

git config --global user.name "Srikanth Merianda"
git config --global user.email "srikanth@ctekksolutions.net"

# Use -A to handle bracket paths like [slug] and [number]
git add -A

echo "Staged files:"
git diff --cached --name-only

STAGED=$(git diff --cached --name-only | wc -l)

if [ "$STAGED" -gt "0" ]; then
  git commit -m "fix: remove onPass server→client function prop — use router.refresh() in QuizComponent"
  echo ""
  echo "Pushing to GitHub..."
  git push origin main
  echo ""
  echo "=============================================="
  echo "  DEPLOYED — Vercel rebuilds in ~2 min"
  echo "=============================================="
  echo ""
  echo "After deploy, module pages will load again."
  echo "Quiz will appear, progress will update, certificate will generate."
else
  echo "Nothing staged. Running git status to diagnose:"
  git status
fi
