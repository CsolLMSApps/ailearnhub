#!/bin/bash
# DEPLOY_PROGRESS_FIX.sh
# Marks modules as complete on visit (no quiz required for modules 1-4).
# Module 5 still requires passing the final quiz.

set -e
cd /c/Users/Macbook/Downloads/ailearnhub-main

echo ""
echo "=============================================="
echo "  Deploying progress auto-mark fix"
echo "=============================================="
echo ""

git config --global user.name "Srikanth Merianda"
git config --global user.email "srikanth@ctekksolutions.net"

git add -A

echo "Staged files:"
git diff --cached --name-only

STAGED=$(git diff --cached --name-only | wc -l)

if [ "$STAGED" -gt "0" ]; then
  git commit -m "feat: auto-mark modules complete on visit — progress updates as user reads"
  git push origin main
  echo ""
  echo "=============================================="
  echo "  DEPLOYED — Vercel rebuilds in ~2 min"
  echo "=============================================="
  echo ""
  echo "Result:"
  echo "  Opening any module (1-4) → immediately marks it complete"
  echo "  Dashboard progress bar updates as user reads"
  echo "  Module 5 → complete only after passing the Course Final Quiz"
  echo "  Certificate generates when all 5 modules complete"
else
  echo "Nothing new to stage. Git status:"
  git status
fi
