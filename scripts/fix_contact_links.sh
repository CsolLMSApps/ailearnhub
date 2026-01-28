#!/bin/bash

# Fix all mailto: links to use /contact route instead
# This script searches for mailto links and provides fixes

echo "========================================================================"
echo "CONTACT LINK FIX SCANNER"
echo "========================================================================"
echo ""

if [ ! -d ".git" ]; then
    echo "❌ Not in project root. Please run from /c/projects/ailearnhub"
    exit 1
fi

echo "Searching for mailto: links..."
echo ""

# Find all files with mailto links
FILES_WITH_MAILTO=$(grep -r "mailto:" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" . | grep -v "node_modules" | cut -d: -f1 | sort -u)

if [ -z "$FILES_WITH_MAILTO" ]; then
    echo "✅ No mailto: links found"
    exit 0
fi

echo "Files containing mailto: links:"
echo "$FILES_WITH_MAILTO"
echo ""

# Count occurrences
TOTAL_COUNT=$(grep -r "mailto:" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" . | grep -v "node_modules" | wc -l)

echo "Total mailto: occurrences: $TOTAL_COUNT"
echo ""
echo "Recommended fix:"
echo "  Replace: mailto:support@ailearnhub.io"
echo "  With: /contact"
echo ""

read -p "Would you like to automatically fix these? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Applying fixes..."
    
    # Create backup
    BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    while IFS= read -r file; do
        cp "$file" "$BACKUP_DIR/"
        # Replace mailto links with /contact route
        sed -i 's|href="mailto:support@ailearnhub\.io"|href="/contact"|g' "$file"
        sed -i "s|href='mailto:support@ailearnhub\.io'|href='/contact'|g" "$file"
        echo "   ✅ Fixed: $file"
    done <<< "$FILES_WITH_MAILTO"
    
    echo ""
    echo "✅ All fixes applied"
    echo "   Backup created in: $BACKUP_DIR"
else
    echo "Skipping automatic fixes."
fi
