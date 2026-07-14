$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Push-Location (Join-Path $root 'backend')
try {
  pnpm install --frozen-lockfile
  pnpm run check
  pnpm run test:unit
} finally { Pop-Location }
Push-Location (Join-Path $root 'frontend')
try { pnpm install --frozen-lockfile; pnpm run build } finally { Pop-Location }
Write-Host 'Static verification completed. Run scripts/run-junit.ps1 with the backend active for API tests.'
