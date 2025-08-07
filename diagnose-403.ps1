param(
    [Parameter(Mandatory=$true)]
    [string]$ApiKey
)

Write-Host "=== CometApi 403 错误诊断工具 ===" -ForegroundColor Green
Write-Host "API Key: $($ApiKey.Substring(0,12))..." -ForegroundColor Yellow

# 测试不同的配置组合
$testConfigs = @(
    @{ BaseUrl = "https://api.cometapi.com"; Endpoint = "/models"; Method = "GET"; Name = "默认-模型列表" },
    @{ BaseUrl = "https://api.cometapi.com/v1"; Endpoint = "/models"; Method = "GET"; Name = "V1-模型列表" },
    @{ BaseUrl = "https://api.cometapi.com"; Endpoint = "/chat/completions"; Method = "POST"; Name = "默认-聊天" },
    @{ BaseUrl = "https://api.cometapi.com/v1"; Endpoint = "/chat/completions"; Method = "POST"; Name = "V1-聊天" }
)

$successCount = 0
$results = @()

foreach ($config in $testConfigs) {
    Write-Host "`n测试: $($config.Name)" -ForegroundColor Cyan
    Write-Host "URL: $($config.BaseUrl)$($config.Endpoint)" -ForegroundColor Gray
    
    try {
        $headers = @{
            'Authorization' = "Bearer $ApiKey"
            'Content-Type' = 'application/json'
            'Accept' = 'application/json'
            'User-Agent' = 'n8n-diagnostic/1.0'
        }
        
        if ($config.Method -eq "POST") {
            $body = @{
                model = "gpt-3.5-turbo"
                messages = @(@{ role = "user"; content = "test" })
                max_tokens = 5
            } | ConvertTo-Json -Depth 3
            
            $response = Invoke-RestMethod -Uri "$($config.BaseUrl)$($config.Endpoint)" -Method POST -Headers $headers -Body $body -TimeoutSec 10
        } else {
            $response = Invoke-RestMethod -Uri "$($config.BaseUrl)$($config.Endpoint)" -Method GET -Headers $headers -TimeoutSec 10
        }
        
        Write-Host "  ✅ 成功!" -ForegroundColor Green
        $successCount++
        
        $result = @{
            Config = $config.Name
            Status = "成功"
            Details = ""
        }
        
        if ($config.Endpoint -eq "/models") {
            $modelCount = 0
            if ($response.data) { $modelCount = $response.data.Length }
            elseif ($response.models) { $modelCount = $response.models.Length }
            elseif ($response -is [array]) { $modelCount = $response.Length }
            
            Write-Host "    模型数量: $modelCount" -ForegroundColor Cyan
            $result.Details = "找到 $modelCount 个模型"
        }
        
        if ($config.Endpoint -eq "/chat/completions" -and $response.choices) {
            $content = $response.choices[0].message.content
            Write-Host "    响应内容: $($content.Substring(0, [Math]::Min(50, $content.Length)))..." -ForegroundColor Cyan
            $result.Details = "聊天功能正常"
        }
        
        $results += $result
        
    } catch {
        $statusCode = "unknown"
        $errorMessage = $_.Exception.Message
        
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            
            # 尝试读取响应内容
            try {
                $stream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($stream)
                $responseBody = $reader.ReadToEnd()
                $reader.Close()
                
                if ($responseBody) {
                    $errorData = $responseBody | ConvertFrom-Json -ErrorAction SilentlyContinue
                    if ($errorData.error.message) {
                        $errorMessage = $errorData.error.message
                    }
                }
            } catch {
                # 忽略读取错误
            }
        }
        
        Write-Host "  ❌ 失败 - 状态码: $statusCode" -ForegroundColor Red
        Write-Host "    错误: $errorMessage" -ForegroundColor Gray
        
        $result = @{
            Config = $config.Name
            Status = "失败 ($statusCode)"
            Details = $errorMessage
        }
        $results += $result
        
        # 403 特定分析
        if ($statusCode -eq 403) {
            Write-Host "  🔍 403 错误分析:" -ForegroundColor Yellow
            
            if ($errorMessage -match "insufficient.*credit|quota.*exceeded|billing") {
                Write-Host "    → 可能是账户余额或配额问题" -ForegroundColor Yellow
            } elseif ($errorMessage -match "invalid.*key|unauthorized") {
                Write-Host "    → 可能是 API Key 无效" -ForegroundColor Yellow
            } elseif ($errorMessage -match "permission|access.*denied") {
                Write-Host "    → 可能是权限不足" -ForegroundColor Yellow
            } else {
                Write-Host "    → 需要检查账户状态和 API Key 配置" -ForegroundColor Yellow
            }
        } elseif ($statusCode -eq 401) {
            Write-Host "  🔍 401 错误 → API Key 认证失败" -ForegroundColor Yellow
        } elseif ($statusCode -eq 429) {
            Write-Host "  🔍 429 错误 → 请求频率限制" -ForegroundColor Yellow
        }
    }
    
    Start-Sleep -Seconds 1  # 避免请求太频繁
}

Write-Host "`n=== 诊断结果汇总 ===" -ForegroundColor Green
Write-Host "成功的配置: $successCount / $($testConfigs.Length)" -ForegroundColor Cyan

foreach ($result in $results) {
    $color = if ($result.Status -eq "成功") { "Green" } else { "Red" }
    Write-Host "$($result.Config): $($result.Status)" -ForegroundColor $color
    if ($result.Details) {
        Write-Host "  $($result.Details)" -ForegroundColor Gray
    }
}

Write-Host "`n=== 建议措施 ===" -ForegroundColor Yellow

if ($successCount -eq 0) {
    Write-Host "🚨 所有测试都失败了，建议检查:" -ForegroundColor Red
    Write-Host "1. API Key 是否正确且有效" -ForegroundColor White
    Write-Host "2. CometApi 账户状态是否正常" -ForegroundColor White
    Write-Host "3. 账户余额是否充足" -ForegroundColor White
    Write-Host "4. 是否使用了正确类型的 API Key（平台 vs 模型专用）" -ForegroundColor White
} elseif ($successCount -lt $testConfigs.Length) {
    Write-Host "⚠️ 部分配置成功，建议:" -ForegroundColor Yellow
    Write-Host "1. 使用成功的 Base URL 配置" -ForegroundColor White
    Write-Host "2. 某些功能可能受限，检查 API Key 权限" -ForegroundColor White
} else {
    Write-Host "✅ 所有测试都成功！API Key 配置正常" -ForegroundColor Green
}
