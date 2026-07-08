param([string]$BaseUrl = 'http://localhost:3000/api')
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Push-Location (Join-Path $root 'tests\junit')
try {
  $mavenArgs = @("-Dbugboard.baseUrl=$BaseUrl", 'test')
  & mvn @mavenArgs
  if ($LASTEXITCODE -ne 0) { throw 'JUnit suite failed.' }
} finally {
  Pop-Location
}
