# CometApi PowerShell Proxy Server
# 解决 n8n 被 Cloudflare 阻止的问题

$apiKey = "sk-5BHJPSovrj2TJBgIJK31maYOsSSphkhQom4xndiXlnl0Z6oU"

Write-Host "=== CometApi PowerShell 代理服务 ===" -ForegroundColor Green
Write-Host "启动中..." -ForegroundColor Yellow
Write-Host "本地地址: http://localhost:8899/api/models" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Gray

try {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:8899/")
    $listener.Start()
    
    Write-Host "✅ 代理服务已启动，等待 n8n 请求..." -ForegroundColor Green
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        Write-Host "`n📡 收到请求: $($request.Url)" -ForegroundColor Yellow
        
        # 设置 CORS headers
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
        
        if ($request.HttpMethod -eq "OPTIONS") {
            # 处理预检请求
            $response.StatusCode = 200
            $response.OutputStream.Close()
            Write-Host "✅ CORS 预检请求已处理" -ForegroundColor Green
            continue
        }
        
        if ($request.Url.AbsolutePath -eq "/api/models") {
            try {
                Write-Host "🔄 转发请求到 CometApi..." -ForegroundColor Cyan
                
                $headers = @{
                    "Authorization" = "Bearer $apiKey"
                    "Content-Type" = "application/json"
                }
                
                $apiResponse = Invoke-RestMethod -Uri "https://api.cometapi.com/v1/models" -Method GET -Headers $headers -TimeoutSec 15
                
                $jsonResponse = $apiResponse | ConvertTo-Json -Depth 10 -Compress
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonResponse)
                
                $response.ContentType = "application/json"
                $response.ContentLength64 = $buffer.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                
                Write-Host "✅ 代理请求成功，返回数据给 n8n" -ForegroundColor Green
                
            } catch {
                Write-Host "❌ API 请求失败: $($_.Exception.Message)" -ForegroundColor Red
                
                $errorResponse = @{
                    error = "Proxy request failed"
                    message = $_.Exception.Message
                    timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                } | ConvertTo-Json -Compress
                
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorResponse)
                $response.ContentType = "application/json"
                $response.ContentLength64 = $buffer.Length
                $response.StatusCode = 500
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
        } else {
            Write-Host "❌ 未知路径: $($request.Url.AbsolutePath)" -ForegroundColor Red
            $response.StatusCode = 404
        }
        
        $response.OutputStream.Close()
    }
    
} catch {
    Write-Host "❌ 代理服务错误: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    if ($listener) {
        $listener.Stop()
        Write-Host "🛑 代理服务已停止" -ForegroundColor Yellow
    }
}
