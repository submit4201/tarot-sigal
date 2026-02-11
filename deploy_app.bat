@echo off
echo ==========================================
echo   Gridpunk Arcana - Deployment Script
echo ==========================================

echo [1/2] Building Project...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Exiting...
    exit /b %errorlevel%
)

echo [2/2] Deploying to Appwrite...
appwrite deploy hosting
if %errorlevel% neq 0 (
    echo Deployment failed!
    exit /b %errorlevel%
)

echo ==========================================
echo   Deployment Complete!
echo ==========================================
pause
