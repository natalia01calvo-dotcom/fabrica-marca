param([int]$Port = 5173)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "EVOREN Fabrica de Assets sirviendo $root en http://localhost:$Port/"
$mime = @{
  ".html" = "text/html"; ".js" = "application/javascript"; ".css" = "text/css";
  ".png" = "image/png"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg";
  ".svg" = "image/svg+xml"; ".json" = "application/json"; ".ico" = "image/x-icon"
}
$exportsDir = Join-Path $root "exports"
if (-not (Test-Path $exportsDir)) { New-Item -ItemType Directory -Path $exportsDir | Out-Null }

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  $path = $req.Url.LocalPath
  try {
    if ($req.HttpMethod -eq "POST" -and $path -eq "/api/save") {
      $reader = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
      $bodyJson = $reader.ReadToEnd()
      $body = $bodyJson | ConvertFrom-Json
      $safeName = [System.IO.Path]::GetFileName($body.filename)
      $outPath = Join-Path $exportsDir $safeName
      $bytes = [System.Convert]::FromBase64String($body.dataBase64)
      [System.IO.File]::WriteAllBytes($outPath, $bytes)
      $res.Headers.Add("Access-Control-Allow-Origin", "*")
      $res.ContentType = "application/json"
      $ok = [System.Text.Encoding]::UTF8.GetBytes((@{ ok = $true; path = $outPath; bytes = $bytes.Length } | ConvertTo-Json))
      $res.OutputStream.Write($ok, 0, $ok.Length)
    } else {
      if ($path -eq "/") { $path = "/index.html" }
      $file = Join-Path $root ($path.TrimStart("/") -replace "/", [System.IO.Path]::DirectorySeparatorChar)
      if (Test-Path $file -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($file)
        $ct = $mime[$ext]
        if (-not $ct) { $ct = "application/octet-stream" }
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $res.ContentType = $ct
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        $res.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
        $res.OutputStream.Write($msg, 0, $msg.Length)
      }
    }
  } catch {
    $res.StatusCode = 500
    $errMsg = [System.Text.Encoding]::UTF8.GetBytes("500: $($_.Exception.Message)")
    $res.OutputStream.Write($errMsg, 0, $errMsg.Length)
  } finally {
    $res.OutputStream.Close()
  }
}
