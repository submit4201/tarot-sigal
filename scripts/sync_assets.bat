@echo off
setlocal
cd /d "%~dp0.."
echo Syncing Tarot Assets to DigitalOcean Spaces...
python scripts/upload_assets.py
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Sync failed. Please check your .env and Internet connection.
)
pause
