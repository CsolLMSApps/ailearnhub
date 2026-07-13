#!/bin/bash
git rm --cached middleware.ts 2>/dev/null || true
rm -f middleware.ts
git add -A
git commit --author="Srikanth Merianda <srikanth@ctekksolutions.net>" -m "feat: enhanced admin panel with analytics, add/delete users, better UI"
git push origin main
