# 🚀 Easy Startup Script for Bug Tracker

Write-Host "🚀 Starting Bug Tracker Services..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Docker services
Write-Host "📦 Checking Docker services..." -ForegroundColor Yellow
$dockerRunning = docker ps --format "{{.Names}}" 2>$null
if ($dockerRunning -match "bugtracker-postgres") {
    Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
} else {
    Write-Host "❌ PostgreSQL not running. Starting Docker services..." -ForegroundColor Red
    docker-compose -f docker-compose.dev.yml up -d
    Start-Sleep -Seconds 3
}

# Step 2: Generate Prisma Client
Write-Host ""
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\prisma"
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client generated successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Prisma generate had issues. Make sure no services are running." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 To start the services, open 4 SEPARATE terminals and run:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 (Auth Service):" -ForegroundColor Yellow
Write-Host "  cd services\auth-service" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (Bug Service):" -ForegroundColor Yellow  
Write-Host "  cd services\bug-service" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 3 (Notification Service):" -ForegroundColor Yellow
Write-Host "  cd services\notification-service" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 4 (Frontend):" -ForegroundColor Yellow
Write-Host "  pnpm dev" -ForegroundColor White
Write-Host ""
Write-Host "📊 Test accounts:" -ForegroundColor Cyan
Write-Host "  Admin: admin@bugtracker.com / TestPass123!" -ForegroundColor White
Write-Host "  Developer: developer@bugtracker.com / TestPass123!" -ForegroundColor White
Write-Host "  Viewer: viewer@bugtracker.com / TestPass123!" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Frontend will be at: http://localhost:3000" -ForegroundColor Green
Write-Host ""
