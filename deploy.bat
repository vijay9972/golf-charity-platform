@echo off
echo Starting deployment for Golf Charity Platform...

echo Installing Backend Dependencies...
cd backend
call npm install

echo Starting Production Server...
set NODE_ENV=production
start http://localhost:5000
node server.js
