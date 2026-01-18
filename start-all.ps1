# Start all services for Bug Tracker SaaS
# Run this script from the project root directory

Write-Host "Starting Bug Tracker SaaS..." -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is running
Write-Host "Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgCheck = Test-NetConnection -ComputerName localhost -Port 5433 -WarningAction SilentlyContinue -ErrorAction Stop
    if ($pgCheck.TcpTestSucceeded) {
        Write-Host "[OK] PostgreSQL is running on port 5433" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] PostgreSQL is not running on port 5433" -ForegroundColor Red
        Write-Host "   Start PostgreSQL and try again" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "[WARN] Could not verify PostgreSQL status" -ForegroundColor Yellow
}

Write-Host ""

# Check if Redis is running
Write-Host "Checking Redis..." -ForegroundColor Yellow
try {
    $redisCheck = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue -ErrorAction Stop
    if ($redisCheck.TcpTestSucceeded) {
        Write-Host "[OK] Redis is running on port 6379" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Redis is not running on port 6379" -ForegroundColor Yellow
        Write-Host "   Bug service caching will be disabled" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[WARN] Could not verify Redis status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Cyan
Write-Host ""

# Start Auth Service
Write-Host "[AUTH] Starting Auth Service (port 5001)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\services\auth-service'; Write-Host 'AUTH SERVICE' -ForegroundColor Magenta; npm run dev"

Start-Sleep -Seconds 2

# Start Bug Service
Write-Host "[BUG] Starting Bug Service (port 5002)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\services\bug-service'; Write-Host 'BUG SERVICE' -ForegroundColor Blue; npm run dev"

Start-Sleep -Seconds 2

# Start Notification Service
Write-Host "[NOTIFY] Starting Notification Service (port 5003)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\services\notification-service'; Write-Host 'NOTIFICATION SERVICE' -ForegroundColor Yellow; npm run dev"

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "[WEB] Starting Frontend (port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host 'FRONTEND' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "[OK] All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "   Frontend:      http://localhost:3000" -ForegroundColor White
Write-Host "   Auth Service:  http://localhost:5001" -ForegroundColor White
Write-Host "   Bug Service:   http://localhost:5002" -ForegroundColor White
Write-Host "   Notification:  http://localhost:5003" -ForegroundColor White
Write-Host ""
Write-Host "Tip: Close all service windows to stop the application" -ForegroundColor Yellow
Write-Host ""

# Keep this window open
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
