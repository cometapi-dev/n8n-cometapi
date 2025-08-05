# CometApi 连接测试工具
param(
    [Parameter(Mandatory=$true)]
    [string]$ApiKey,
    
    [string]$BaseUrl = "https://api.cometapi.com"
)

Write-Host "=== CometApi 连接测试 ===" -ForegroundColor Green

$headers = @{
    'Authorization' = "Bearer $ApiKey"
    'Content-Type' = 'application/json'
    'User-Agent' = 'n8n-test/1.0'
}

# 测试 1: Models 端点
try {
    Write-Host "测试 1: $BaseUrl/models" -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "$BaseUrl/models" -Method GET -Headers $headers
    Write-Host "✅ Models 端点成功" -ForegroundColor Green
    $response.data | Select-Object -First 5 | ForEach-Object {
        Write-Host "  模型: $($_.id)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Models 端点失败: $($_.Exception.Message)" -ForegroundColor Red
}

# 测试 2: Chat Completions 端点
try {
    Write-Host "`n测试 2: $BaseUrl/chat/completions" -ForegroundColor Yellow
    $body = @{
        model = "gpt-3.5-turbo"
        messages = @(@{ role = "user"; content = "Hello, this is a test" })
        max_tokens = 10
    } | ConvertTo-Json -Depth 3

    $response = Invoke-RestMethod -Uri "$BaseUrl/chat/completions" -Method POST -Headers $headers -Body $body
    Write-Host "✅ Chat Completions 端点成功" -ForegroundColor Green
    Write-Host "  回复: $($response.choices[0].message.content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Chat Completions 端点失败: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "  状态码: $statusCode" -ForegroundColor Gray
    }
}
