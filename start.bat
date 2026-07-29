@echo off
echo Starting Chrono-Timer...
echo.
echo 1) Web Mode (Browser Only - No Rust required)
echo 2) Desktop Mode (Requires Rust to be installed)
echo.
set /p choice="Please select a mode (1 or 2) [Default: 1]: "

if "%choice%"=="2" (
    echo Starting Desktop App via Tauri...
    npm run tauri dev
) else (
    echo Starting Web App via Vite...
    npm run dev
)
