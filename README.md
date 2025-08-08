CometAPI n8n Node
License: MIT
n8n
Node.js

A powerful and flexible n8n community node for interacting with various AI APIs including  OpenAI, Anthropic Claude... Features smart URL routing, custom JSON request bodies, and comprehensive debugging capabilities.

✨ Features
🎯 Smart URL Routing: Automatic endpoint selection based on AI model
🔄 Multiple Configuration Modes: Auto, Custom Base URL, and Manual Override
📝 Custom JSON Support: Full control over request bodies with custom JSON
🚀 Multi-Service Support: CometAPI, OpenAI, Anthropic Claude, and custom APIs
🛠️ Flexible Request Bodies: Form fields, Custom JSON, or merged configurations
🌐 HTTP Method Support: POST, GET, PUT, PATCH
🐛 Advanced Debugging: Detailed logging and request/response inspection
⚡ Error Handling: Comprehensive error handling with continue-on-fail support
🔧 Highly Configurable: Extensive options for fine-tuning requests
🚀 Installation
Method 1: Community Nodes (Recommended)
In your n8n instance, go to Settings > Community Nodes
Click Install a Community Node
Enter the package name: n8n-nodes-cometapi
Click Install
Method 2: Manual Installation
bash
# Navigate to your n8n installation directory
cd ~/.n8n/nodes

# Install the node
npm install n8n-nodes-cometapi

# Restart n8n
Method 3: Development Setup
bash
# Clone the repository
git clone https://github.com/your-username/n8n-nodes-cometapi.git
cd n8n-nodes-cometapi

# Install dependencies
npm install

# Build the node
npm run build

# Link for development
npm link
cd ~/.n8n/nodes
npm link n8n-nodes-cometapi

# Start n8n
npx n8n start
📖 Quick Start
Basic Usage
Add the CometAPI node to your workflow
Configure your API key for the service you want to use
Select URL Configuration mode:
Auto: Automatically routes based on selected model
Custom: Use your own base URL
Manual: Complete control over endpoint and request body
Choose your AI model (in Auto/Custom modes)
Enter your message and optional system message
Execute the workflow
Example: Simple Chat with CometAPI
json
{
  "resource": "chat",
  "operation": "sendMessage",
  "apiKey": "your-comet-api-key",
  "urlMode": "auto",
  "model": "comet-gpt-3.5-turbo",
  "message": "Hello, how are you?",
  "systemMessage": "You are a helpful assistant."
}
🔧 Configuration Options
URL Configuration Modes
1. Auto Mode (Recommended)
Automatically selects the appropriate API endpoint based on your chosen model.

Supported Models:

CometAPI: GPT-3.5 Turbo, GPT-4, GPT-5
OpenAI: GPT-3.5 Turbo, GPT-4, GPT-4 Turbo
Anthropic: Claude 3 Opus, Claude 3 Sonnet
Custom: Define your own model and endpoint
2. Custom Base URL
Use your own base URL while maintaining model-based endpoint routing.

json
{
  "urlMode": "custom",
  "baseUrl": "https://your-proxy-server.com",
  "model": "comet-gpt-4"
}
3. Manual Override
Complete control over the API endpoint and request body.

Request Body Modes:

Form Fields: Use standard message and system fields
Custom JSON: Provide completely custom JSON request body
Merge: Combine form fields with custom JSON (JSON takes priority)
Custom JSON Examples
OpenAI Chat Completion
json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user", 
      "content": "Hello!"
    }
  ],
  "max_tokens": 150,
  "temperature": 0.7
}
DALL-E Image Generation
json
{
  "model": "dall-e-3",
  "prompt": "A cute baby sea otter",
  "n": 1,
  "size": "1024x1024"
}
Anthropic Claude
json
{
  "model": "claude-3-opus-20240229",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": "Hello Claude!"
    }
  ]
}
Additional Configuration
Request Parameters
Max Tokens: Maximum number of tokens to generate (1-8192)
Temperature: Controls randomness (0-2, default: 0.7)
Top P: Controls diversity via nucleus sampling (0-1, default: 1)
Frequency Penalty: Penalize frequent tokens (-2 to 2, default: 0)
Presence Penalty: Penalize new tokens (-2 to 2, default: 0)
Options
Continue On Fail: Continue processing if request fails
Debug Mode: Enable detailed logging
Show URL Mapping: Display selected URL in debug output
Validate JSON: Validate custom JSON syntax
Timeout: Request timeout in seconds (1-300, default: 30)
📝 Usage Examples
Example 1: Auto Mode with CometAPI
json
{
  "nodes": [
    {
      "name": "CometAPI Chat",
      "type": "n8n-nodes-cometapi.cometAPI",
      "parameters": {
        "resource": "chat",
        "operation": "sendMessage",
        "apiKey": "your-api-key",
        "urlMode": "auto",
        "model": "comet-gpt-4",
        "message": "Explain quantum computing in simple terms",
        "systemMessage": "You are a science teacher explaining complex topics simply.",
        "additionalFields": {
          "maxTokens": 500,
          "temperature": 0.7
        }
      }
    }
  ]
}
Example 2: Manual Override with Custom JSON
json
{
  "nodes": [
    {
      "name": "Custom API Call",
      "type": "n8n-nodes-cometapi.cometAPI",
      "parameters": {
        "resource": "chat",
        "operation": "sendMessage",
        "apiKey": "your-api-key",
        "urlMode": "manual",
        "manualUrl": "https://api.cometapi.com/v1/custom",
        "httpMethod": "POST",
        "requestBodyMode": "json",
        "customRequestBody": "{\n  \"model\": \"custom-model\",\n  \"prompt\": \"Generate a haiku about technology\",\n  \"max_length\": 100\n}"
      }
    }
  ]
}
Example 3: Using Expressions
json
{
  "customRequestBody": "{\n  \"model\": \"gpt-3.5-turbo\",\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": \"{{ $json.userMessage }}\"\n    }\n  ],\n  \"temperature\": {{ $json.temperature || 0.7 }}\n}"
}
🔍 Debugging
Enable debugging to get detailed information about requests and responses:

In Options, enable Debug Mode
Optionally enable Show URL Mapping to see endpoint selection
Check the execution logs for detailed information
Debug Output Includes:

Selected URL and endpoint
Request headers and body
Full API response
Model and service information
Error details with HTTP status codes
❌ Error Handling
The node provides comprehensive error handling with descriptive messages:

400 Bad Request: Invalid request format or parameters
401 Unauthorized: Invalid API key
403 Forbidden: API key permissions issue
404 Not Found: Invalid endpoint URL
422 Unprocessable Entity: Invalid request parameters
429 Rate Limit: Too many requests
500+ Server Errors: API service issues
Connection Errors: Network connectivity issues
Enable Continue On Fail to handle errors gracefully in workflows.

🔑 API Keys
Getting API Keys
CometAPI: Visit CometAPI Dashboard
Security Best Practices
Store API keys as n8n credentials
Use environment variables for API keys
Regularly rotate your API keys
Monitor API usage and costs
🛠️ Troubleshooting
Common Issues
Message Field Not Visible
Ensure you've selected Resource: Chat and Operation: Send Message
In Manual Override mode with JSON request body, the message field is not used
Check that all required fields above the message are filled
"Message is required" Error
In Auto/Custom modes, the message field is mandatory
In Manual Override JSON mode, define messages in your custom JSON
Check for leading/trailing spaces in your message
Invalid JSON Error
Validate your JSON syntax using an online JSON validator
Ensure proper escaping of quotes and special characters
Use n8n expressions correctly with proper syntax
Connection Errors
Verify your API endpoint URL
Check your internet connection
Ensure API key has proper permissions
Try increasing the timeout value
Debug Steps
Enable Debug Mode in Options
Check the execution log for detailed error information
Verify API key permissions and validity
Test with a simple request first
Check API service status if all else fails
🤝 Contributing
We welcome contributions! Please see our Contributing Guide for details.

Development
bash
# Clone the repository
git clone https://github.com/your-username/n8n-nodes-cometapi.git

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build for production
npm run build
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🆘 Support
Issues: GitHub Issues
Discussions: GitHub Discussions
n8n Community: n8n Community Forum
🔗 Links
CometAPI https://api.cometapi.com
📊 Changelog
v1.0.0
Initial release
Smart URL routing with Auto/Custom/Manual modes
Support for CometAPI, OpenAI, and Anthropic
Custom JSON request body support
Comprehensive error handling and debugging
Made with ❤️ for the n8n community
