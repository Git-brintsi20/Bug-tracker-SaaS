# Quick Start - No DB Check (Development)
# Use this if PostgreSQL/Redis are already running or you want to start services anyway

Write-Host "Starting Bug Tracker SaaS (Dev Mode)..." -ForegroundColor Cyan
Write-Host ""

# Start Auth Service
Write-Host "[AUTH] Starting Auth Service (port 5001)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\services\auth-service'; Write-Host 'AUTH SERVICE - Port 5001' -ForegroundColor Magenta; npm run dev"

Start-Sleep -Seconds 3

# Start Bug Service
Write-Host "[BUG] Starting Bug Service (port 5002)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\services\bug-service'; Write-Host 'BUG SERVICE - Port 5002' -ForegroundColor Blue; npm run dev"

Start-Sleep -Seconds 3

# Start Notification Service
Write-Host "[NOTIFY] Starting Notification Service (port 5003)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\services\notification-service'; Write-Host 'NOTIFICATION SERVICE - Port 5003' -ForegroundColor Yellow; npm run dev"

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "[WEB] Starting Frontend (port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host 'FRONTEND - Port 3000' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "[OK] All services starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "   Frontend:      http://localhost:3000" -ForegroundColor White
Write-Host "   Auth Service:  http://localhost:5001" -ForegroundColor White
Write-Host "   Bug Service:   http://localhost:5002" -ForegroundColor White
Write-Host "   Notification:  http://localhost:5003" -ForegroundColor White
Write-Host ""
Write-Host "Note: Services may take 10-20 seconds to fully start" -ForegroundColor Yellow
Write-Host "Tip: Close all service windows to stop" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
