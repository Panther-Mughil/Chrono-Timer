Write-Host "Starting Chrono-Timer..." -ForegroundColor Cyan
Write-Host ""

Write-Host "1) Web Mode (Browser Only - No Rust required)"
Write-Host "2) Desktop Mode (Requires Rust to be installed)"
Write-Host ""

$choice = Read-Host "Please select a mode (1 or 2) [Default: 1]"

if ($choice -eq "2") {
    Write-Host "Starting Desktop App via Tauri..." -ForegroundColor Green
    npm run tauri dev
} else {
    Write-Host "Starting Web App via Vite..." -ForegroundColor Green
    npm run dev
}
