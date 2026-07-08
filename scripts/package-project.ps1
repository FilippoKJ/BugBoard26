param([string]$GroupId = 'ID_GRUPPO_DA_INSERIRE')
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$output = Join-Path (Split-Path -Parent $root) "$GroupId.zip"
$excluded = @('.git', 'node_modules', 'dist', 'target', '.scannerwork', '.env')
$items = Get-ChildItem -LiteralPath $root -Force | Where-Object { $_.Name -notin $excluded }
Compress-Archive -Path $items.FullName -DestinationPath $output -Force
Write-Host "Package created at $output"
