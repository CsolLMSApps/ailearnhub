#!/bin/bash
# DEPLOY_FINAL_QUIZ.sh
# 1. Runs seed-final-quiz.js to replace per-module quizzes with one Course Final Quiz
# 2. Deploys updated module page (quiz only on last module, free nav on 1-4)
#
# Usage:
#   bash /c/Users/Macbook/Downloads/ailearnhub-main/DEPLOY_FINAL_QUIZ.sh "YOUR_SERVICE_ROLE_KEY"

set -e
cd /c/Users/Macbook/Downloads/ailearnhub-main

SERVICE_KEY="$1"
if [ -z "$SERVICE_KEY" ]; then
  echo "Usage: bash DEPLOY_FINAL_QUIZ.sh \"YOUR_SERVICE_ROLE_KEY\""
  exit 1
fi

echo ""
echo "=============================================="
echo "  Step 1: Seed Course Final Quiz"
echo "=============================================="
node seed-final-quiz.js "$SERVICE_KEY"

echo ""
echo "=============================================="
echo "  Step 2: Deploy module page changes"
echo "=============================================="

git config --global user.name "Srikanth Merianda"
git config --global user.email "srikanth@ctekksolutions.net"

git add -A

echo "Staged files:"
git diff --cached --name-only

STAGED=$(git diff --cached --name-only | wc -l)

if [ "$STAGED" -gt "0" ]; then
  git commit -m "feat: course final quiz only — free navigation on modules 1-4, quiz on last module"
  git push origin main
  echo ""
  echo "=============================================="
  echo "  DEPLOYED — Vercel rebuilds in ~2 min"
  echo "=============================================="
  echo ""
  echo "Result:"
  echo "  Modules 1-4  → read freely, Next Module button always unlocked"
  echo "  Module 5     → Course Final Quiz (10 questions, 2 per module)"
  echo "  Pass 70%     → progress updates + certificate generates"
else
  echo "No code changes to deploy (DB was still updated above)."
fi
