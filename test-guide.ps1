Write-Host "=== CometApi 节点测试指南 ===" -ForegroundColor Green

Write-Host "`n1. 重启 n8n:" -ForegroundColor Yellow
Write-Host "   - 在 n8n 终端按 Ctrl+C" -ForegroundColor Gray
Write-Host "   - 运行: npx n8n start" -ForegroundColor Gray

Write-Host "`n2. 测试步骤:" -ForegroundColor Yellow
Write-Host "   a) 创建新工作流" -ForegroundColor Gray
Write-Host "   b) 添加 CometApi 节点" -ForegroundColor Gray
Write-Host "   c) 配置凭据 (输入 API Key)" -ForegroundColor Gray
Write-Host "   d) 设置测试 prompt，如: 'Hello, how are you?'" -ForegroundColor Gray
Write-Host "   e) 选择模型 (建议先用 gpt-3.5-turbo)" -ForegroundColor Gray
Write-Host "   f) 执行节点" -ForegroundColor Gray

Write-Host "`n3. 期望输出:" -ForegroundColor Yellow
Write-Host "   - content: AI 的回复文本" -ForegroundColor Gray
Write-Host "   - usage: token 使用统计" -ForegroundColor Gray
Write-Host "   - 不再有循环引用错误" -ForegroundColor Gray

Write-Host "`n4. 如果出现错误:" -ForegroundColor Yellow
Write-Host "   - 检查 API Key 是否正确" -ForegroundColor Gray
Write-Host "   - 确认 https://api.cometapi.com 可访问" -ForegroundColor Gray
Write-Host "   - 查看节点输出中的 error 字段" -ForegroundColor Gray

Write-Host "`n5. 调试信息:" -ForegroundColor Yellow
Write-Host "   - 节点现在会显示详细的错误信息" -ForegroundColor Gray
Write-Host "   - 包括 HTTP 状态码和错误描述" -ForegroundColor Gray
