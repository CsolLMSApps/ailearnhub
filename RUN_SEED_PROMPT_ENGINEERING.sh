#!/bin/bash
# RUN_SEED_PROMPT_ENGINEERING.sh

set -e

PROJECT_DIR="/c/Users/Macbook/Downloads/ailearnhub-main"
cd "$PROJECT_DIR"

echo ""
echo "================================================"
echo "  Seeding Prompt Engineering Mastery course"
echo "================================================"
echo ""

# ── Find .env.local (Windows Notepad often saves as .txt) ────────────────────
ENV_FILE=""
for candidate in ".env.local" ".env.local.txt" "env.local" "env.local.txt" ".env" ".env.txt"; do
  if [ -f "$PROJECT_DIR/$candidate" ]; then
    ENV_FILE="$PROJECT_DIR/$candidate"
    echo "✅  Found env file: $candidate"
    break
  fi
done

if [ -z "$ENV_FILE" ]; then
  echo ""
  echo "❌  Could not find .env.local"
  echo ""
  echo "   Please create it manually:"
  echo "   1. Open Notepad"
  echo "   2. Paste exactly this (fill in your values from Vercel):"
  echo ""
  echo "      NEXT_PUBLIC_SUPABASE_URL=https://jqlynkmzduibfivycmze.supabase.co"
  echo "      SUPABASE_SERVICE_ROLE_KEY=<your service_role key from Vercel>"
  echo ""
  echo "   3. Save as: C:\\Users\\Macbook\\Downloads\\ailearnhub-main\\.env.local"
  echo "      (In Notepad: File → Save As → change 'Save as type' to 'All Files' → filename: .env.local)"
  echo ""
  echo "   Then run this script again."
  exit 1
fi

# Copy to standard name if needed
if [ "$ENV_FILE" != "$PROJECT_DIR/.env.local" ]; then
  cp "$ENV_FILE" "$PROJECT_DIR/.env.local"
  echo "✅  Copied to .env.local"
fi

# Check node is available
if ! command -v node &> /dev/null; then
  echo "❌  ERROR: Node.js not found. Is it installed?"
  exit 1
fi

echo ""
echo "Running seed script..."
echo ""
node "$PROJECT_DIR/seed-prompt-engineering.js"

echo ""
echo "================================================"
echo "  Done! No git push needed — DB updated directly"
echo "================================================"
echo ""
