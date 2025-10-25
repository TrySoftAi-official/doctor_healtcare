@echo off
echo Adding database indexes...
cd /d "%~dp0"
npx ts-node add-database-indexes.ts
pause
