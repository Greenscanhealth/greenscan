@echo off
cd /d C:\greenscan-production-project
"%ProgramFiles%\nodejs\npm.cmd" exec -- wrangler login
pause
