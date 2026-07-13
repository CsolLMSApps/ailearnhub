#!/bin/bash
cd "$(dirname "$0")"
git rm --cached middleware.ts 2>/dev/null || true
rm -f middleware.ts
git add -A
git commit --author="Srikanth Merianda <srikanth@ctekksolutions.net>" -m "fix: move admin auth to layout getUser, proxy skips /admin routes"
git push origin main
