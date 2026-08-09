@echo off
setlocal
cd /d C:\greenscan-production-project

if not exist "wrangler.toml" (
  echo Missing wrangler.toml in C:\greenscan-production-project
  pause
  exit /b 1
)

if not exist "cloudflare-worker.js" (
  echo Missing cloudflare-worker.js in C:\greenscan-production-project
  pause
  exit /b 1
)

"%ProgramFiles%\nodejs\npm.cmd" exec -- wrangler whoami
if errorlevel 1 (
  echo.
  echo Cloudflare is not logged in for Wrangler.
  echo Run login-cloudflare.cmd first, then run this deploy again.
  pause
  exit /b 1
)

"%ProgramFiles%\nodejs\npm.cmd" exec -- wrangler deploy
pause
