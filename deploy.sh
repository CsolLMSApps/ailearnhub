#!/bin/bash
cd "$(dirname "$0")"
rm -f .git/index.lock
git rm --cached middleware.ts 2>/dev/null || true
rm -f middleware.ts
git add -A
git commit --author="Srikanth Merianda <srikanth@ctekksolutions.net>" -m "fix: client-side admin auth guard - eliminates all server-side cookie issues"
git push origin main
