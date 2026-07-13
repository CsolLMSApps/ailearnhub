@echo off
cd /d "%~dp0"
git rm --cached middleware.ts 2>nul
del middleware.ts 2>nul
git add -A
git commit --author="Srikanth Merianda <srikanth@ctekksolutions.net>" -m "fix: admin auth via proxy header, enhanced admin panel"
git push origin main
pause
