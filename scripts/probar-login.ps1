$s = Read-Host "Clave admin" -AsSecureString
$p = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s))
Write-Host "Largo de la clave:" $p.Length
$body = @{ username = 'admin'; password = $p } | ConvertTo-Json
try {
  $resp = Invoke-WebRequest -UseBasicParsing -Method Post -Uri 'http://localhost:3000/api/auth/login' -ContentType 'application/json' -Body $body -SessionVariable web
  Write-Host "LOGIN:" $resp.StatusCode
  Invoke-RestMethod 'http://localhost:3000/api/auth/me' -WebSession $web | ConvertTo-Json
} catch {
  Write-Host "LOGIN FALLO:" ([int]$_.Exception.Response.StatusCode)
}
