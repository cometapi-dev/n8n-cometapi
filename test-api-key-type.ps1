# CometApi API Key 类型测试脚本
param(
    [Parameter(Mandatory=$true)]
    [string]$ApiKey
)

Write-Host "=== 测试 API Key: $($ApiKey.Substring(0,10))... ===" -ForegroundColor Green

$baseUrls = @(
    "https://api.cometapi.com",
    "https://api.cometapi.com/v1"
)

foreach ($baseUrl in $baseUrls) {
    Write-Host "`n测试端点: $baseUrl" -ForegroundColor Cyan
    
    # 测试 1: 列出模型 (需要平台 API Key)
    try {
        Write-Host "  1. 测试 /models 端点..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$baseUrl/models" -Method GET -Headers @{
            'Authorization' = "Bearer $ApiKey"
            'Content-Type' = 'application/json'
        }
        
        if ($response.data -or $response.models -or ($response -is [array])) {
            $count = if ($response.data) { $response.data.Length } elseif ($response.models) { $response.models.Length } else { $response.Length }
            Write-Host "    ✅ 成功 - 找到 $count 个模型" -ForegroundColor Green
            Write-Host "    → 这是平台整体 API Key" -ForegroundColor Cyan
            
            # 显示前几个模型
            $models = if ($response.data) { $response.data } elseif ($response.models) { $response.models } else { $response }
            if ($models -is [array] -and $models.Length -gt 0) {
                Write-Host "    可用模型示例:" -ForegroundColor Gray
                $models | Select-Object -First 3 | ForEach-Object {
                    $modelId = if ($_.id) { $_.id } else { $_ }
                    Write-Host "      - $modelId" -ForegroundColor Gray
                }
            }
        } else {
            Write-Host "    ⚠️ 响应格式不符合预期" -ForegroundColor Yellow
        }
        
    } catch {
        $statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { "unknown" }
        Write-Host "    ❌ 失败 - 状态码: $statusCode" -ForegroundColor Red
        Write-Host "    错误: $($_.Exception.Message)" -ForegroundColor Gray
        
        if ($statusCode -eq 403) {
            Write-Host "    → 可能是模型专用 API Key，无法访问平台功能" -ForegroundColor Yellow
        }
    }
    
    # 测试 2: 简单聊天测试 (两种 Key 都可能支持)
    try {
        Write-Host "  2. 测试 /chat/completions 端点..." -ForegroundColor Yellow
        $chatBody = @{
            model = "gpt-3.5-turbo"
            messages = @(@{ role = "user"; content = "Hello" })
            max_tokens = 10
        } | ConvertTo-Json -Depth 3
        
        $response = Invoke-RestMethod -Uri "$baseUrl/chat/completions" -Method POST -Headers @{
            'Authorization' = "Bearer $ApiKey"
            'Content-Type' = 'application/json'
        } -Body $chatBody
        
        if ($response.choices -and $response.choices.Length -gt 0) {
            Write-Host "    ✅ 聊天功能正常" -ForegroundColor Green
        } else {
            Write-Host "    ⚠️ 聊天响应格式异常" -ForegroundColor Yellow
        }
        
    } catch {
        $statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { "unknown" }
        Write-Host "    ❌ 聊天测试失败 - 状态码: $statusCode" -ForegroundColor Red
    }
}

Write-Host "`n=== 建议 ===" -ForegroundColor Green
Write-Host "如果 /models 端点成功:" -ForegroundColor Cyan
Write-Host "  ✅ 这是平台整体 API Key，适合用于 n8n" -ForegroundColor Green
Write-Host "如果 /models 端点失败但聊天成功:" -ForegroundColor Cyan
Write-Host "  ⚠️ 这可能是模型专用 API Key" -ForegroundColor Yellow
Write-Host "  ⚠️ 建议使用平台整体 API Key 以获得完整功能" -ForegroundColor Yellow
