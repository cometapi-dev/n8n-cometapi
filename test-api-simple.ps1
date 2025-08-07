Write-Host "=== CometApi 403 Quick Test ===" -ForegroundColor Yellow

$apiKey = "sk-5BHJPSovrj2TJBgIJK31maYOsSSphkhQom4xndiXlnl0Z6oU"

Write-Host "`nAPI Key Analysis:" -ForegroundColor Cyan
Write-Host "Length: $($apiKey.Length) characters" -ForegroundColor Gray
Write-Host "Prefix: $($apiKey.Substring(0, 12))..." -ForegroundColor Gray

if ($apiKey.StartsWith('sk-')) {
    Write-Host "Format: Valid (starts with sk-)" -ForegroundColor Green
} else {
    Write-Host "Format: Invalid (should start with sk-)" -ForegroundColor Red
}

if ($apiKey.Length -eq 51) {
    Write-Host "Length: Correct (51 characters)" -ForegroundColor Green
} else {
    Write-Host "Length: Incorrect (expected 51, got $($apiKey.Length))" -ForegroundColor Red
}

Write-Host "`nTesting CometApi endpoint..." -ForegroundColor Cyan

try {
    $headers = @{
        "Authorization" = "Bearer $apiKey"
        "Content-Type" = "application/json"
        "Accept" = "application/json"
    }
    
    Write-Host "Sending request to: https://api.cometapi.com/v1/models" -ForegroundColor Gray
    $response = Invoke-RestMethod -Uri "https://api.cometapi.com/v1/models" -Method GET -Headers $headers -TimeoutSec 15
    
    Write-Host "✅ SUCCESS! API connection working!" -ForegroundColor Green
    Write-Host "Response received successfully" -ForegroundColor Gray
    
    if ($response.data) {
        Write-Host "Models found: $($response.data.Count)" -ForegroundColor Green
    } elseif ($response.models) {
        Write-Host "Models found: $($response.models.Count)" -ForegroundColor Green
    } else {
        Write-Host "Response type: $($response.GetType().Name)" -ForegroundColor Gray
    }
    
} catch {
    $errorCode = 0
    $errorMessage = $_.Exception.Message
    
    if ($_.Exception.Response) {
        $errorCode = $_.Exception.Response.StatusCode.value__
    }
    
    Write-Host "❌ FAILED - HTTP Status: $errorCode" -ForegroundColor Red
    Write-Host "Error Message: $errorMessage" -ForegroundColor Gray
    
    if ($errorCode -eq 403) {
        Write-Host "`n🔍 403 FORBIDDEN ERROR ANALYSIS:" -ForegroundColor Yellow
        Write-Host "=================================" -ForegroundColor Yellow
        Write-Host "This error means the server understood the request" -ForegroundColor White
        Write-Host "but refuses to authorize it. Common causes:" -ForegroundColor White
        Write-Host ""
        Write-Host "1. 🔑 Invalid API Key:" -ForegroundColor Red
        Write-Host "   • API key is incorrect or malformed" -ForegroundColor Gray
        Write-Host "   • API key has been revoked or expired" -ForegroundColor Gray
        Write-Host ""
        Write-Host "2. 💰 Account Issues:" -ForegroundColor Red
        Write-Host "   • Insufficient account balance/credits" -ForegroundColor Gray
        Write-Host "   • Account suspended or billing problem" -ForegroundColor Gray
        Write-Host "   • Free trial expired" -ForegroundColor Gray
        Write-Host ""
        Write-Host "3. 🚫 Permission Issues:" -ForegroundColor Red
        Write-Host "   • API key lacks required permissions" -ForegroundColor Gray
        Write-Host "   • Rate limiting or quota exceeded" -ForegroundColor Gray
        Write-Host "   • Geographic or IP restrictions" -ForegroundColor Gray
        Write-Host ""
        Write-Host "💡 RECOMMENDED ACTIONS:" -ForegroundColor Cyan
        Write-Host "=======================" -ForegroundColor Cyan
        Write-Host "1. Check CometApi dashboard for account status" -ForegroundColor White
        Write-Host "2. Verify API key is active and valid" -ForegroundColor White
        Write-Host "3. Check account balance and billing" -ForegroundColor White
        Write-Host "4. Contact CometApi support if issue persists" -ForegroundColor White
        
    } elseif ($errorCode -eq 401) {
        Write-Host "`n🔍 401 UNAUTHORIZED - Invalid API Key" -ForegroundColor Red
        
    } elseif ($errorCode -eq 429) {
        Write-Host "`n🔍 429 RATE LIMITED - Too many requests" -ForegroundColor Red
        
    } elseif ($errorCode -eq 400) {
        Write-Host "`n🔍 400 BAD REQUEST - Check URL and parameters" -ForegroundColor Red
        
    } else {
        Write-Host "`n🔍 Unexpected error code: $errorCode" -ForegroundColor Red
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Yellow
