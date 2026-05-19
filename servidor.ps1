# Servidor HTTP simples para o Panela Solidaria Dashboard
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 3000
$url  = "http://localhost:$port/"

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.csv'  = 'text/csv; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.ico'  = 'image/x-icon'
    '.json' = 'application/json; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host ""
Write-Host "  Panela Solidaria Dashboard rodando em:"
Write-Host "  --> http://localhost:$port"
Write-Host ""
Write-Host "  Pressione Ctrl+C para parar o servidor."
Write-Host ""

# Abre o navegador automaticamente
Start-Process "http://localhost:$port"

while ($listener.IsListening) {
    try {
        $ctx  = $listener.GetContext()
        $req  = $ctx.Request
        $resp = $ctx.Response

        $rawPath = $req.Url.LocalPath.TrimStart('/').Replace('/', '\')
        if ($rawPath -eq '') { $rawPath = 'index.html' }
        $filePath = Join-Path $root $rawPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext         = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
            $bytes        = [System.IO.File]::ReadAllBytes($filePath)

            $resp.ContentType   = $contentType
            $resp.ContentLength64 = $bytes.Length
            $resp.StatusCode    = 200
            $resp.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $msg   = [System.Text.Encoding]::UTF8.GetBytes("404 - Arquivo nao encontrado: $rawPath")
            $resp.StatusCode    = 404
            $resp.ContentType   = 'text/plain; charset=utf-8'
            $resp.ContentLength64 = $msg.Length
            $resp.OutputStream.Write($msg, 0, $msg.Length)
        }

        $resp.OutputStream.Close()
    } catch {
        # Ignora erros de conexao fechada pelo cliente
    }
}
