@echo off
echo Running comprehensive database seeding script...
cd /d "%~dp0.."
npm run seed:comprehensive
pause
