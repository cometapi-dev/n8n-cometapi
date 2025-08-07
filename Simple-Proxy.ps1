# 简单 CometApi 代理
$apiKey = "sk-5BHJPSovrj2TJBgIJK31maYOsSSphkhQom4xndiXlnl0Z6oU"

Write-Host "🚀 CometApi 代理启动中..." -ForegroundColor Green
Write-Host "地址: http://localhost:8899/api/models" -ForegroundColor Cyan

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8899/")
$listener.Start()

Write-Host "✅ 代理已启动！等待 n8n 请求..." -ForegroundColor Green

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    Write-Host "`n📨 收到请求: $($request.Url.AbsolutePath)" -ForegroundColor Yellow
    
    # CORS 设置
    $response.Headers.Add("Access-Control-Allow-Origin", "*")
    $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
    
    if ($request.HttpMethod -eq "OPTIONS") {
        $response.StatusCode = 200
        $response.OutputStream.Close()
        continue
    }
    
    try {
        if ($request.Url.AbsolutePath -like "*/models*") {
            Write-Host "🔄 获取模型列表..." -ForegroundColor Cyan
            
            $headers = @{
                "Authorization" = "Bearer $apiKey"
            }
            
            $apiResponse = Invoke-RestMethod -Uri "https://api.cometapi.com/v1/models" -Method GET -Headers $headers
            $json = $apiResponse | ConvertTo-Json -Depth 5
            
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json"
            $response.StatusCode = 200
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            
            Write-Host "✅ 模型列表返回成功" -ForegroundColor Green
        } else {
            $errorJson = '{"error":"Use /api/models endpoint"}'
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorJson)
            $response.ContentType = "application/json"
            $response.StatusCode = 404
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
    } catch {
        Write-Host "❌ 代理错误: $($_.Exception.Message)" -ForegroundColor Red
        $errorJson = @{error = $_.Exception.Message} | ConvertTo-Json
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorJson)
        $response.ContentType = "application/json"
        $response.StatusCode = 500
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    }
    
    $response.OutputStream.Close()
}
