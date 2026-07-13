@echo off
cd /d "%~dp0"
git rm --cached middleware.ts 2>nul
del middleware.ts 2>nul
git add -A
git commit --author="Srikanth Merianda <srikanth@ctekksolutions.net>" -m "fix: proxy cookie corruption, admin area header auth"
git push origin main
pause
