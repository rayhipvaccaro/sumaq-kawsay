$api = 'http://127.0.0.1:3001'
$j = 'application/json'
$script:fail = 0

function Plain($s){ [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)) }

function Api($m, $u, $h, $b){
  try {
    $p = @{ Method = $m; Uri = "$api$u"; ContentType = $j }
    if ($h) { $p.Headers = $h }
    if ($b) { $p.Body = ($b | ConvertTo-Json -Depth 5) }
    $r = Invoke-RestMethod @p
    return @{ code = 200; body = $r }
  } catch {
    $c = 0
    if ($_.Exception.Response) { $c = [int]$_.Exception.Response.StatusCode }
    return @{ code = $c; body = $null }
  }
}

function Check($name, $got, $want){
  if ($got -eq $want) { "OK    $name" }
  else { "FALLA $name (salio $got, debia $want)"; $script:fail++ }
}

function Bearer($tok){ @{ Authorization = "Bearer $tok" } }
function NewPass(){ 'A6-' + [guid]::NewGuid().ToString('N').Substring(0, 12) }

# ---------- admin ----------
$ap = Plain (Read-Host "Clave admin" -AsSecureString)
$l = Api 'POST' '/auth/login' $null @{ username = 'admin'; password = $ap }
$ap = $null
if ($l.code -ne 200) { "No pude entrar como admin (codigo $($l.code)). Reviso Nest y el tunel."; return }
if ($l.body.mustChangePassword -eq $true) { "Admin aun tiene clave temporal. Corre primero el cambio de clave (A5b)."; return }
$A = Bearer $l.body.accessToken

$test = Api 'GET' '/areas' $A $null
if ($test.code -ne 200) { "GET /areas dio $($test.code). Falta el modulo de areas o app.module.ts."; return }

function EnsureArea($name){
  $f = @((Api 'GET' '/areas' $A $null).body) | Where-Object { $_.name -eq $name } | Select-Object -First 1
  if (-not $f) { $f = (Api 'POST' '/areas' $A @{ name = $name }).body }
  return $f
}

function EnsureActivity($name, $areaId){
  $f = @((Api 'GET' '/activities' $null $null).body) | Where-Object { $_.name -eq $name } | Select-Object -First 1
  if (-not $f) { $f = (Api 'POST' '/activities' $A @{ name = $name; areaId = $areaId }).body }
  return $f
}

$role = @((Api 'GET' '/roles' $A $null).body) | Where-Object { $_.name -eq 'Encargado de area' } | Select-Object -First 1
if (-not $role) { $role = (Api 'POST' '/roles' $A @{ name = 'Encargado de area'; description = 'Prueba A6' }).body }

function EnsureUser($username, $areaId){
  $u = @((Api 'GET' '/users' $A $null).body) | Where-Object { $_.username -eq $username } | Select-Object -First 1
  if ($u) {
    if (-not $u.active) { Api 'PATCH' "/users/$($u.id)/active" $A @{ active = $true } | Out-Null }
    $r = Api 'POST' "/users/$($u.id)/reset-password" $A $null
    return @{ id = $u.id; temp = $r.body.tempPassword }
  }
  $r = Api 'POST' '/users' $A @{ username = $username; fullName = "Prueba $username"; roleId = $role.id; areaId = $areaId }
  return @{ id = $r.body.user.id; temp = $r.body.tempPassword }
}

$areaUno = EnsureArea 'Prueba A6 Uno'
$areaDos = EnsureArea 'Prueba A6 Dos'
$actUno = EnsureActivity 'Actividad A6 Uno' $areaUno.id
$actDos = EnsureActivity 'Actividad A6 Dos' $areaDos.id
"Listo: areas y actividades de prueba. Empiezan las pruebas."
""

# ---------- a6uno ----------
$u1 = EnsureUser 'a6uno' $areaUno.id
$lg = Api 'POST' '/auth/login' $null @{ username = 'a6uno'; password = $u1.temp }
Check "1) a6uno entra con clave temporal (200)" $lg.code 200
Check "2) debe cambiar la clave (True)" $lg.body.mustChangePassword $true
$T0 = Bearer $lg.body.accessToken
Check "3) con clave temporal NO puede pedir /me/activities (403)" (Api 'GET' '/me/activities' $T0 $null).code 403
Check "4) con clave temporal SI puede pedir /auth/me (200)" (Api 'GET' '/auth/me' $T0 $null).code 200

$new1 = NewPass
$cp = Api 'POST' '/auth/change-password' $T0 @{ currentPassword = $u1.temp; newPassword = $new1 }
Check "5) a6uno cambia su clave (200)" $cp.code 200
$T1 = Bearer $cp.body.accessToken
Check "6) el token viejo ya no sirve (401)" (Api 'GET' '/auth/me' $T0 $null).code 401
Check "7) el token nuevo si sirve (200)" (Api 'GET' '/me/activities' $T1 $null).code 200

$mine = @((Api 'GET' '/me/activities' $T1 $null).body)
Check "8) a6uno ve solo su area" (($mine.Count -ge 1) -and (@($mine | Where-Object { $_.area.name -ne $areaUno.name }).Count -eq 0)) $true
Check "9) a6uno NO ve la actividad de la otra area" @($mine | Where-Object { $_.id -eq $actDos.id }).Count 0

Check "10) a6uno crea recursos en su actividad (200)" (Api 'POST' "/activities/$($actUno.id)/resources" $T1 @{ name = 'Recurso A6'; count = 2 }).code 200
$when = (Get-Date).ToUniversalTime().AddDays(40).AddMinutes((Get-Random -Maximum 100000)).ToString('yyyy-MM-ddTHH:mm:ss.000Z')
Check "11) a6uno crea horario en su actividad (200)" (Api 'POST' "/activities/$($actUno.id)/slots" $T1 @{ startsAt = $when }).code 200
Check "12) a6uno NO crea horario en la actividad de otra area (403)" (Api 'POST' "/activities/$($actDos.id)/slots" $T1 @{ startsAt = $when }).code 403
Check "13) a6uno NO puede crear usuarios (403)" (Api 'POST' '/users' $T1 @{}).code 403
Check "14) a6uno NO puede crear areas (403)" (Api 'POST' '/areas' $T1 @{ name = 'Intruso' }).code 403
Check "15) a6uno pide sus reservas (200)" (Api 'GET' '/me/bookings' $T1 $null).code 200

# ---------- a6dos ----------
$u2 = EnsureUser 'a6dos' $areaDos.id
$lg2 = Api 'POST' '/auth/login' $null @{ username = 'a6dos'; password = $u2.temp }
$T2a = Bearer $lg2.body.accessToken
$new2 = NewPass
$cp2 = Api 'POST' '/auth/change-password' $T2a @{ currentPassword = $u2.temp; newPassword = $new2 }
$T2 = Bearer $cp2.body.accessToken
$mine2 = @((Api 'GET' '/me/activities' $T2 $null).body)
Check "16) a6dos ve solo su area" (($mine2.Count -ge 1) -and (@($mine2 | Where-Object { $_.area.name -ne $areaDos.name }).Count -eq 0)) $true
Check "17) a6dos NO ve la actividad de a6uno" @($mine2 | Where-Object { $_.id -eq $actUno.id }).Count 0

# ---------- admin ve todo ----------
$all = @((Api 'GET' '/me/activities' $A $null).body)
Check "18) admin ve las dos actividades" ((@($all | Where-Object { $_.id -eq $actUno.id }).Count -eq 1) -and (@($all | Where-Object { $_.id -eq $actDos.id }).Count -eq 1)) $true
Check "19) admin pide reservas (200)" (Api 'GET' '/me/bookings' $A $null).code 200

# ---------- tokens viejos ----------
$rs = Api 'POST' "/users/$($u1.id)/reset-password" $A $null
Check "20) admin restablece la clave de a6uno (200)" $rs.code 200
Check "21) el token de a6uno muere tras el reset (401)" (Api 'GET' '/auth/me' $T1 $null).code 401

Check "22) admin desactiva a a6dos (200)" (Api 'PATCH' "/users/$($u2.id)/active" $A @{ active = $false }).code 200
Check "23) el token de a6dos muere al desactivarlo (401)" (Api 'GET' '/auth/me' $T2 $null).code 401
Check "24) a6dos no puede entrar desactivado (401)" (Api 'POST' '/auth/login' $null @{ username = 'a6dos'; password = $new2 }).code 401

# ---------- bloqueo ----------
1..5 | ForEach-Object { Api 'POST' '/auth/login' $null @{ username = 'a6uno'; password = 'clave-mala-xx' } | Out-Null }
Check "25) tras 5 intentos malos a6uno queda bloqueado (423)" (Api 'POST' '/auth/login' $null @{ username = 'a6uno'; password = $rs.body.tempPassword }).code 423
$rs2 = Api 'POST' "/users/$($u1.id)/reset-password" $A $null
Check "26) el admin lo desbloquea al restablecer (200)" (Api 'POST' '/auth/login' $null @{ username = 'a6uno'; password = $rs2.body.tempPassword }).code 200

# ---------- limpieza ----------
Api 'PATCH' "/users/$($u1.id)/active" $A @{ active = $false } | Out-Null
"" 
if ($script:fail -eq 0) { "TODO BIEN: A6 pasa. Usuarios de prueba a6uno y a6dos quedaron desactivados." }
else { "Fallas: $($script:fail). Pegame las lineas que dicen FALLA." }
$new1 = $null; $new2 = $null
