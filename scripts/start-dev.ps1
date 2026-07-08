$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$backend = Start-Process -FilePath 'pnpm' -ArgumentList 'dev' -WorkingDirectory (Join-Path $root 'backend') -PassThru
$frontend = Start-Process -FilePath 'pnpm' -ArgumentList 'dev' -WorkingDirectory (Join-Path $root 'frontend') -PassThru
Write-Host "Backend PID $($backend.Id), frontend PID $($frontend.Id)"
Write-Host 'Press Enter to stop both processes.'
Read-Host | Out-Null
Stop-Process -Id $backend.Id, $frontend.Id -ErrorAction SilentlyContinue
