@echo off
echo Starting 4D Tasker Application...

echo.
echo [1/2] Starting Backend Server on port 5000...
start cmd /k "cd backend && npm install && npm run dev"

echo [2/2] Starting Frontend Vite Server on port 5173...
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Both servers are starting up!
echo Backend: http://localhost:5000
echo Swagger API Docs: http://localhost:5000/api-docs
echo Frontend: http://localhost:5173
