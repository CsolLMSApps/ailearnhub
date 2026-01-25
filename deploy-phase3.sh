#!/bin/bash

# ============================================
# PHASE 3: QUIZ SYSTEM DEPLOYMENT
# AI Learn Hub - January 25, 2026
# ============================================

echo "🎯 Starting Phase 3 Quiz System Deployment..."
echo ""

# Navigate to project directory
cd /c/projects/ailearnhub || { echo "❌ Error: Project directory not found"; exit 1; }

# Verify Git configuration
echo "📋 Verifying Git configuration..."
CURRENT_USER=$(git config user.name)
CURRENT_EMAIL=$(git config user.email)

if [ "$CURRENT_USER" != "Srikanth Merianda" ] || [ "$CURRENT_EMAIL" != "srikanth@ctekksolutions.net" ]; then
  echo "⚙️  Setting Git configuration..."
  git config user.name "Srikanth Merianda"
  git config user.email "srikanth@ctekksolutions.net"
fi

echo "✅ Git configured as: $CURRENT_USER <$CURRENT_EMAIL>"
echo ""

# Create necessary directories
echo "📁 Creating component directories..."
mkdir -p components/quiz
mkdir -p app/api/quiz/submit
mkdir -p "app/api/quiz/[courseSlug]"
mkdir -p "app/api/quiz/[courseSlug]/[moduleNumber]"
echo "✅ Directories created"
echo ""

# Instruction to copy files
echo "📦 MANUAL STEP REQUIRED:"
echo "   Copy the following files from the phase3-quiz-system folder:"
echo ""
echo "   1. components/quiz/QuizComponent.tsx"
echo "   2. components/quiz/QuestionCard.tsx"
echo "   3. components/quiz/ResultsSummary.tsx"
echo "   4. app/api/quiz/[courseSlug]/[moduleNumber]/route.ts"
echo "   5. app/api/quiz/submit/route.ts"
echo ""
read -p "Press ENTER when files are copied..."
echo ""

# Check if files exist
echo "🔍 Verifying files..."
FILES_MISSING=0

if [ ! -f "components/quiz/QuizComponent.tsx" ]; then
  echo "❌ Missing: components/quiz/QuizComponent.tsx"
  FILES_MISSING=1
fi

if [ ! -f "components/quiz/QuestionCard.tsx" ]; then
  echo "❌ Missing: components/quiz/QuestionCard.tsx"
  FILES_MISSING=1
fi

if [ ! -f "components/quiz/ResultsSummary.tsx" ]; then
  echo "❌ Missing: components/quiz/ResultsSummary.tsx"
  FILES_MISSING=1
fi

if [ $FILES_MISSING -eq 1 ]; then
  echo ""
  echo "❌ Some files are missing. Please copy all files before continuing."
  exit 1
fi

echo "✅ All files present"
echo ""

# Run local build test
echo "🔨 Testing local build..."
npm run build

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Build failed! Please fix TypeScript errors before deploying."
  echo ""
  echo "Common issues:"
  echo "  - Missing imports"
  echo "  - Type errors in quiz components"
  echo "  - Syntax errors"
  echo ""
  exit 1
fi

echo "✅ Build successful!"
echo ""

# Git operations
echo "📝 Staging changes..."
git add .

echo "💬 Creating commit..."
git commit -m "feat: Phase 3 - Quiz System Implementation

- Add QuizComponent with question navigation
- Add QuestionCard for individual questions  
- Add ResultsSummary with answer review
- Add quiz API routes (GET quiz, POST submit)
- Integrate quiz into module viewer
- Auto-complete modules on passing quiz (70%+)
- Show correct answers and explanations
- Support unlimited retries
- Track all attempts in quiz_results table
- Update progress on quiz pass"

if [ $? -ne 0 ]; then
  echo "⚠️  No changes to commit (or commit failed)"
  read -p "Continue with push anyway? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo ""
echo "🚀 Pushing to GitHub..."
git push https://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@github.com/CsolLMSApps/ailearnhub.git main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Deployment successful!"
  echo ""
  echo "📊 Next Steps:"
  echo "   1. ⏱️  Wait 2-3 minutes for Vercel auto-deploy"
  echo "   2. 🔗 Monitor: https://vercel.com/srikanths-projects-69539bac/ailearnhub"
  echo "   3. 🗄️  Load quiz data into Supabase (see load-quiz-data.sql)"
  echo "   4. 🧪 Test quiz system on live site"
  echo "   5. ✅ Verify module completion on quiz pass"
  echo ""
  echo "🎉 Phase 3 deployment initiated!"
else
  echo ""
  echo "❌ Push failed! Check your network connection and GitHub token."
  exit 1
fi
