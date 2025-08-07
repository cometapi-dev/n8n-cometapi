$apiKey = "sk-5BHJPSovrj2TJBgIJK31maYOsSSphkhQom4xndiXlnl0Z6oU"
$baseUrl = "https://api.cometapi.com"

Write-Host "=== API Key 状态检查 ===" -ForegroundColor Green

# 测试不同的端点和方法
$testEndpoints = @(
    @{ Method = "GET"; Url = "/models"; Name = "models" },
    @{ Method = "GET"; Url = "/v1/models"; Name = "v1/models" },
    @{ Method = "POST"; Url = "/chat/completions"; Name = "chat" },
    @{ Method = "POST"; Url = "/v1/chat/completions"; Name = "v1/chat" }
)

foreach ($test in $testEndpoints) {
    try {
        Write-Host "`n测试: $($test.Method) $baseUrl$($test.Url)" -ForegroundColor Yellow
        
        $headers = @{
            'Authorization' = "Bearer $apiKey"
            'Content-Type' = 'application/json'
            'User-Agent' = 'n8n-test/1.0'
        }
        
        if ($test.Method -eq "POST") {
            $body = @{
                model = "gpt-3.5-turbo"
                messages = @(@{ role = "user"; content = "test" })
                max_tokens = 10
            } | ConvertTo-Json -Depth 3
            
            $response = Invoke-RestMethod -Uri "$baseUrl$($test.Url)" -Method $test.Method -Headers $headers -Body $body
        } else {
            $response = Invoke-RestMethod -Uri "$baseUrl$($test.Url)" -Method $test.Method -Headers $headers
        }
        
        Write-Host "  ✅ 成功: $($test.Name)" -ForegroundColor Green
        
        if ($response.data) {
            Write-Host "    响应包含 data 字段，长度: $($response.data.Length)" -ForegroundColor Cyan
        }
        if ($response.choices) {
            Write-Host "    响应包含 choices 字段，长度: $($response.choices.Length)" -ForegroundColor Cyan
        }
        
    } catch {
        $statusCode = "unknown"
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
        }
        
        Write-Host "  ❌ 失败: $($test.Name) - 状态码: $statusCode" -ForegroundColor Red
        Write-Host "    错误: $($_.Exception.Message)" -ForegroundColor Gray
        
        if ($statusCode -eq 401) {
            Write-Host "    → API Key 无效或格式错误" -ForegroundColor Yellow
        } elseif ($statusCode -eq 403) {
            Write-Host "    → 权限不足或账户限制" -ForegroundColor Yellow
        } elseif ($statusCode -eq 429) {
            Write-Host "    → 请求频率限制" -ForegroundColor Yellow
        } elseif ($statusCode -eq 404) {
            Write-Host "    → 端点不存在" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n=== 测试完成 ===" -ForegroundColor Green
