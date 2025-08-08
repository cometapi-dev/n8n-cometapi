// import {
//   INodeExecutionData,
//   INodeType,
//   INodeTypeDescription,
//   IDataObject,
//   NodeOperationError,
//   IExecuteFunctions
// } from 'n8n-workflow';

// export class CometApi implements INodeType {
//    description: INodeTypeDescription = {
//     displayName: 'CometAPI',
//     name: 'cometAPI',
//     icon: 'file:cometApi.svg',
//     group: ['transform'],
//     version: 1,
//     subtitle: '={{$parameter["operation"]}}',
//     description: 'Interact with CometAPI',
//     defaults: {
//       name: 'CometAPI',
//     },
//     inputs: ['main'],
//     outputs: ['main'],
//     requestDefaults: {
//       headers: {
//         'Authorization': 'Bearer {{$parameter.apiKey}}',
//         'Content-Type': 'application/json',
//       },
//     },
//     properties: [
//       // Resource
//       {
//         displayName: 'Resource',
//         name: 'resource',
//         type: 'options',
//         options: [
//           {
//             name: 'Chat',
//             value: 'chat',
//             description: 'Chat with AI models',
//           },
//         ],
//         default: 'chat',
//         noDataExpression: true,
//         required: true,
//         description: 'The resource to operate on',
//       },
//       // API Key
//       {
//         displayName: 'API Key',
//         name: 'apiKey',
//         type: 'string',
//         typeOptions: {
//           password: true,
//         },
//         default: '',
//         required: true,
//         description: 'Your Comet API Key',
//       },
//       {
//         displayName: 'Base URL',
//         name: 'baseUrl',
//         type: 'string',
//         default: 'https://api.cometapi.com',
//         required: true,
//         description: 'Base URL of the Comet API',
//       },
//       // Operation
//       {
//         displayName: 'Operation',
//         name: 'operation',
//         type: 'options',
//         displayOptions: {
//           show: {
//             resource: ['chat'],
//           },
//         },
//         options: [
//           {
//             name: 'Send Message',
//             value: 'sendMessage',
//             description: 'Send a message to the chat model',
//             action: 'Send a message to chat model',
//           },
//         ],
//         default: 'sendMessage',
//         noDataExpression: true,
//       },
//       // Model Selection
//       {
//         displayName: 'Model',
//         name: 'model',
//         type: 'options',
//         displayOptions: {
//           show: {
//             resource: ['chat'],
//             operation: ['sendMessage'],
//           },
//         },
//         options: [
//           {
//             name: 'GPT-3.5 Turbo',
//             value: 'gpt-3.5-turbo',
//           },
//           {
//             name: 'GPT-4',
//             value: 'gpt-4',
//           },
// 					{
//             name: 'GPT-5',
//             value: 'gpt-5',
//           },
//         ],
//         default: 'gpt-3.5-turbo',
//         description: 'The AI model to use for the chat',
//       },
//       // Custom Model Name
//       {
//         displayName: 'Custom Model Name',
//         name: 'customModel',
//         type: 'string',
//         displayOptions: {
//           show: {
//             resource: ['chat'],
//             operation: ['sendMessage'],
//             model: ['custom'],
//           },
//         },
//         default: '',
//         placeholder: 'your-custom-model-name',
//         description: 'Name of the custom model to use',
//       },
//       // Message
//       {
//         displayName: 'Message',
//         name: 'message',
//         type: 'string',
//         typeOptions: {
//           rows: 4,
//         },
//         displayOptions: {
//           show: {
//             resource: ['chat'],
//             operation: ['sendMessage'],
//           },
//         },
//         default: '',
//         placeholder: 'Enter your message here...',
//         description: 'The message to send to the AI model',
//         required: true,
//       },
//       // System Message
//       {
//         displayName: 'System Message',
//         name: 'systemMessage',
//         type: 'string',
//         typeOptions: {
//           rows: 2,
//         },
//         displayOptions: {
//           show: {
//             resource: ['chat'],
//             operation: ['sendMessage'],
//           },
//         },
//         default: '',
//         placeholder: 'You are a helpful assistant...',
//         description: 'System message to set the behavior of the AI',
//       },
//       // Additional Fields
//       {
//         displayName: 'Additional Fields',
//         name: 'additionalFields',
//         type: 'collection',
//         placeholder: 'Add Field',
//         default: {},
//         displayOptions: {
//           show: {
//             resource: ['chat'],
//             operation: ['sendMessage'],
//           },
//         },
//         options: [
//           {
//             displayName: 'Max Tokens',
//             name: 'maxTokens',
//             type: 'number',
//             typeOptions: {
//               minValue: 1,
//               maxValue: 4000,
//             },
//             default: 150,
//             description: 'Maximum number of tokens to generate',
//           },
//           {
//             displayName: 'Temperature',
//             name: 'temperature',
//             type: 'number',
//             typeOptions: {
//               minValue: 0,
//               maxValue: 2,
//               numberStepSize: 0.1,
//             },
//             default: 0.7,
//             description: 'Controls randomness. Lower values make responses more focused and deterministic.',
//           },
//           {
//             displayName: 'Top P',
//             name: 'topP',
//             type: 'number',
//             typeOptions: {
//               minValue: 0,
//               maxValue: 1,
//               numberStepSize: 0.1,
//             },
//             default: 1,
//             description: 'Controls diversity of responses via nucleus sampling',
//           },
//           {
//             displayName: 'Frequency Penalty',
//             name: 'frequencyPenalty',
//             type: 'number',
//             typeOptions: {
//               minValue: -2,
//               maxValue: 2,
//               numberStepSize: 0.1,
//             },
//             default: 0,
//             description: 'Penalize new tokens based on their existing frequency in the text',
//           },
//           {
//             displayName: 'Presence Penalty',
//             name: 'presencePenalty',
//             type: 'number',
//             typeOptions: {
//               minValue: -2,
//               maxValue: 2,
//               numberStepSize: 0.1,
//             },
//             default: 0,
//             description: 'Penalize new tokens based on whether they appear in the text so far',
//           },
//           {
//             displayName: 'Custom API Endpoint',
//             name: 'customEndpoint',
//             type: 'string',
//             default: '',
//             placeholder: 'https://api.cometapi.com/v1/chat/completions',
//             description: 'Custom API endpoint URL (overrides default)',
//           },
//         ],
//       },
//       // Options
//       {
//         displayName: 'Options',
//         name: 'options',
//         type: 'collection',
//         placeholder: 'Add Option',
//         default: {},
//         options: [
//           {
//             displayName: 'Continue On Fail',
//             name: 'continueOnFail',
//             type: 'boolean',
//             default: false,
//             description: 'Continue processing other items if this one fails',
//           },
//           {
//             displayName: 'Debug Mode',
//             name: 'debugMode',
//             type: 'boolean',
//             default: false,
//             description: 'Enable detailed logging for debugging',
//           },
//           {
//             displayName: 'Timeout (seconds)',
//             name: 'timeout',
//             type: 'number',
//             typeOptions: {
//               minValue: 1,
//               maxValue: 300,
//             },
//             default: 30,
//             description: 'Request timeout in seconds',
//           },
//         ],
//       },
//     ],
//   };

//   async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
//     const items = this.getInputData();
//     const returnData: INodeExecutionData[] = [];
//     const resource = this.getNodeParameter('resource', 0) as string;
//     const operation = this.getNodeParameter('operation', 0) as string;

//     for (let i = 0; i < items.length; i++) {
//       // 在循环开始获取options，确保外层catch也能访问
//       let options: IDataObject = {};
//       try {
//         options = this.getNodeParameter('options', i, {}) as IDataObject;
//       } catch {
//         // 如果获取options失败，使用空对象
//         options = {};
//       }

//       try {
//         if (resource === 'chat' && operation === 'sendMessage') {
//           // 直接从节点参数获取 API Key 和 Base URL
//           const apiKey = this.getNodeParameter('apiKey', i) as string;

//           // 验证 API Key
//           if (!apiKey || !apiKey.trim()) {
//             throw new NodeOperationError(
//               this.getNode(),
//               'API Key is required. Please provide your Comet API Key.',
//               { itemIndex: i }
//             );
//           }

//           // 获取参数
//           const model = this.getNodeParameter('model', i) as string;
//           const customModel = this.getNodeParameter('customModel', i, '') as string;
//           const message = this.getNodeParameter('message', i) as string;
//           const systemMessage = this.getNodeParameter('systemMessage', i, '') as string;
//           const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

//           // 验证必填字段
//           if (!message.trim()) {
//             throw new NodeOperationError(
//               this.getNode(),
//               'Message is required and cannot be empty',
//               { itemIndex: i }
//             );
//           }

//           // 确定使用的模型
//           const modelName = model === 'custom' ? customModel : model;
//           if (!modelName) {
//             throw new NodeOperationError(
//               this.getNode(),
//               'Model name is required. Please select a model or provide a custom model name.',
//               { itemIndex: i }
//             );
//           }

//           // 构建消息数组
//           const messages: IDataObject[] = [];

//           if (systemMessage.trim()) {
//             messages.push({
//               role: 'system',
//               content: systemMessage.trim(),
//             });
//           }

//           messages.push({
//             role: 'user',
//             content: message.trim(),
//           });

//           // 构建请求体
//           const requestBody: IDataObject = {
//             model: modelName,
//             messages,
//           };

//           // 添加可选参数
//           if (additionalFields.maxTokens) {
//             requestBody.max_tokens = additionalFields.maxTokens;
//           }
//           if (additionalFields.temperature !== undefined) {
//             requestBody.temperature = additionalFields.temperature;
//           }
//           if (additionalFields.topP !== undefined) {
//             requestBody.top_p = additionalFields.topP;
//           }
//           if (additionalFields.frequencyPenalty !== undefined) {
//             requestBody.frequency_penalty = additionalFields.frequencyPenalty;
//           }
//           if (additionalFields.presencePenalty !== undefined) {
//             requestBody.presence_penalty = additionalFields.presencePenalty;
//           }

//           // 确定API端点
//           const customEndpoint = additionalFields.customEndpoint as string;
//           const baseUrl = this.getNodeParameter('baseUrl', i) as string;
//           const apiUrl = customEndpoint || `${baseUrl}/v1/chat/completions`;

//           // 调试日志
//           if (options.debugMode) {
//             this.logger.info('=== Comet API Debug Info ===');
//             this.logger.info(`API URL: ${apiUrl}`);
//             this.logger.info(`API Key (masked): ${apiKey.substring(0, 8)}...`);
//             this.logger.info(`Model: ${modelName}`);
//             this.logger.info(`Messages: ${JSON.stringify(messages, null, 2)}`);
//             this.logger.info(`Request Body: ${JSON.stringify(requestBody, null, 2)}`);
//           }

//           // 修复点1: 完全移除 OptionsWithUri 类型声明
//           const requestOptions = {
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${apiKey}`,
//               'User-Agent': 'n8n-comet-api/1.0',
//             },
//             method: 'POST',
//             body: requestBody,
//             url: apiUrl,
//             json: true,
//             timeout: (options.timeout as number || 30) * 1000,
//           };

//           let responseData: any;

//           try {
//             // 发送请求
//             responseData = await this.helpers.request(requestOptions);

//             // 调试日志
//             if (options.debugMode) {
//               this.logger.info(`Raw Response: ${JSON.stringify(responseData, null, 2)}`);
//             }

//             // 检查响应格式
//             if (typeof responseData === 'string') {
//               throw new NodeOperationError(
//                 this.getNode(),
//                 `API returned unexpected response format. Expected JSON but received: ${responseData.substring(0, 200)}...`,
//                 { itemIndex: i }
//               );
//             }

//             // 检查是否包含错误
//             if (responseData.error) {
//               throw new NodeOperationError(
//                 this.getNode(),
//                 `API Error: ${responseData.error.message || 'Unknown error'}`,
//                 { itemIndex: i }
//               );
//             }

//             // 提取响应内容
//             let content = '';
//             if (responseData.choices && responseData.choices.length > 0) {
//               content = responseData.choices[0].message?.content || responseData.choices[0].text || '';
//             }

//             // 构建返回数据
//             const resultData: IDataObject = {
//               message: content,
//               model: modelName,
//               usage: responseData.usage || {},
//               raw_response: responseData,
//             };

//             returnData.push({
//               json: resultData,
//               pairedItem: { item: i },
//             });

//           } catch (error) {
//             if (options.debugMode) {
//               this.logger.error(`Request failed: ${error}`);
//             }

//             // 详细错误处理
//             const err = error as any;
//             let errorMessage = 'Unknown error occurred';

//             if (err.code === 'ENOTFOUND') {
//               errorMessage = 'Could not connect to API endpoint. Please check the URL.';
//             } else if (err.code === 'ETIMEDOUT') {
//               errorMessage = 'Request timed out. Consider increasing the timeout value.';
//             } else if (err.statusCode === 401) {
//               errorMessage = 'Authentication failed. Please check your API key.';
//             } else if (err.statusCode === 403) {
//               errorMessage = 'Access forbidden. Please check your API key permissions.';
//             } else if (err.statusCode === 429) {
//               errorMessage = 'Rate limit exceeded. Please try again later.';
//             } else if (err.statusCode && err.statusCode >= 500) {
//               errorMessage = 'Server error. Please try again later.';
//             } else if (err.message) {
//               errorMessage = err.message;
//             }

//             if (options.continueOnFail) {
//               returnData.push({
//                 json: {
//                   error: errorMessage,
//                   statusCode: err.statusCode || 'N/A',
//                 },
//                 pairedItem: { item: i },
//               });
//               continue;
//             }

//             throw new NodeOperationError(
//               this.getNode(),
//               errorMessage,
//               { itemIndex: i }
//             );
//           }
//         }
//       } catch (error) {
//         // 修复点2: 确保正确使用转换后的 error 对象
//         const outerErr = error as any;

//         // 修复点3: 确保 options 变量在作用域内
//         if (options.continueOnFail) {
//           returnData.push({
//             json: {
//               // 使用转换后的 outerErr 而不是原始的 error
//               error: outerErr.message || 'Unknown error',
//               statusCode: outerErr.statusCode || 'N/A',
//             },
//             pairedItem: { item: i },
//           });
//           continue;
//         }
//         throw error;
//       }
//     }

//     return [returnData];
//   }
// }
import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  NodeOperationError,
  IExecuteFunctions
} from 'n8n-workflow';

// 🔧 将模型配置逻辑移到类外部作为辅助函数
function getModelConfiguration(modelSelection: string): {
  modelName: string;
  baseUrl: string;
  endpoint: string;
  apiFormat: 'openai' | 'anthropic' | 'custom';
  defaultMaxTokens?: number;
} {
  const modelConfigs = {
    // OpenAI Models
    'openai-gpt-3.5-turbo': {
      modelName: 'gpt-3.5-turbo',
      baseUrl: 'https://api.cometapi.com',
      endpoint: '/v1/chat/completions',
      apiFormat: 'openai' as const,
      defaultMaxTokens: 4096,
    },
    'openai-gpt-4': {
      modelName: 'gpt-4',
      baseUrl: 'https://api.cometapi.com',
      endpoint: '/v1/chat/completions',
      apiFormat: 'openai' as const,
      defaultMaxTokens: 8192,
    },
    'openai-gpt-4-turbo': {
      modelName: 'gpt-4-turbo',
      baseUrl: 'https://api.cometapi.com',
      endpoint: '/v1/chat/completions',
      apiFormat: 'openai' as const,
      defaultMaxTokens: 8192,
    },
    // CometAPI Models
    'comet-gpt-3.5-turbo': {
      modelName: 'gpt-3.5-turbo',
      baseUrl: 'https://api.cometapi.com',
      endpoint: '/v1/chat/completions',
      apiFormat: 'openai' as const,
      defaultMaxTokens: 4096,
    },
    'comet-gpt-4': {
      modelName: 'gpt-4',
      baseUrl: 'https://api.cometapi.com',
      endpoint: '/v1/chat/completions',
      apiFormat: 'openai' as const,
      defaultMaxTokens: 8192,
    },
    'comet-gpt-5': {
      modelName: 'gpt-5',
      baseUrl: 'https://api.cometapi.com',
      endpoint: '/v1/chat/completions',
      apiFormat: 'openai' as const,
      defaultMaxTokens: 8192,
    },
    // Anthropic Models
    'anthropic-claude-3-opus': {
      modelName: 'claude-3-opus-20240229',
      baseUrl: 'https://api.cometapi.com',
      endpoint: '/v1/messages',
      apiFormat: 'anthropic' as const,
      defaultMaxTokens: 4096,
    },
  };

  return modelConfigs[modelSelection as keyof typeof modelConfigs] || {
    modelName: modelSelection,
    baseUrl: 'https://api.cometapi.com',
    endpoint: '/v1/chat/completions',
    apiFormat: 'openai' as const,
    defaultMaxTokens: 4096,
  };
}

export class CometApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'CometAPI',
    name: 'cometAPI',
    icon: 'file:cometApi.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Interact with CometAPI - Smart URL routing with custom JSON support',
    defaults: {
      name: 'CometAPI',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      // 1. Resource (最基础)
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          {
            name: 'Chat',
            value: 'chat',
            description: 'Chat with AI models',
          },
        ],
        default: 'chat',
        noDataExpression: true,
        required: true,
        description: 'The resource to operate on',
      },

      // 2. Operation (第二基础)
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['chat'],
          },
        },
        options: [
          {
            name: 'Send Message',
            value: 'sendMessage',
            description: 'Send a message to the chat model',
            action: 'Send a message to chat model',
          },
        ],
        default: 'sendMessage',
        noDataExpression: true,
      },

      // 3. API Key (必需)
      {
        displayName: 'API Key',
        name: 'apiKey',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
          },
        },
        typeOptions: {
          password: true,
        },
        default: '',
        required: true,
        description: 'Your API Key for the selected service',
      },

      // 4. URL Configuration Mode
      {
        displayName: 'URL Configuration',
        name: 'urlMode',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
          },
        },
        options: [
          {
            name: 'Auto (Based on Model)',
            value: 'auto',
            description: 'Automatically select URL based on the chosen model',
          },
          {
            name: 'Custom Base URL',
            value: 'custom',
            description: 'Use a custom base URL for all requests',
          },
          {
            name: 'Manual Override',
            value: 'manual',
            description: 'Manually specify endpoint URL and request body',
          },
        ],
        default: 'auto',
        description: 'How to determine the API endpoint URL',
      },

      // 5. Model Selection (在URL模式之后，Message之前)
      {
        displayName: 'AI Service & Model',
        name: 'model',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
            urlMode: ['auto', 'custom'],
          },
        },
        options: [
          {
            name: 'CometAPI - GPT-3.5 Turbo',
            value: 'comet-gpt-3.5-turbo',
            description: 'CometAPI GPT-3.5 Turbo',
          },
          {
            name: 'CometAPI - GPT-4',
            value: 'comet-gpt-4',
            description: 'CometAPI GPT-4',
          },
          {
            name: 'CometAPI - GPT-5',
            value: 'comet-gpt-5',
            description: 'CometAPI GPT-5 (Preview)',
          },
          {
            name: 'OpenAI - GPT-3.5 Turbo',
            value: 'openai-gpt-3.5-turbo',
            description: 'OpenAI GPT-3.5 Turbo model',
          },
          {
            name: 'OpenAI - GPT-4',
            value: 'openai-gpt-4',
            description: 'OpenAI GPT-4 model',
          }
        ],
        default: 'comet-gpt-3.5-turbo',
        description: 'Select the AI service and model to use',
      },

      // 6. 🔥 Message 字段 - 关键修复：简化条件，放在合适位置
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
          },
        },
        default: '',
        placeholder: 'Enter your message here...(Ignored in Manual Override JSON mode)',
        description: 'The message to send to the AI model',
        required: false,
      },

      // 7. System Message
      {
        displayName: 'System Message',
        name: 'systemMessage',
        type: 'string',
        typeOptions: {
          rows: 2,
        },
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
          },
        },
        default: '',
        placeholder: 'You are a helpful assistant...',
        description: 'System message to set the behavior of the AI',
      },

      // 8. Custom Base URL (只在 custom 模式下显示)
      {
        displayName: 'Base URL',
        name: 'baseUrl',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
            urlMode: ['custom'],
          },
        },
        default: 'https://api.cometapi.com',
        required: true,
        description: 'Base URL of the API service',
      },

      // 9. Manual URL (只在 manual 模式下显示)
      {
        displayName: 'Complete API Endpoint',
        name: 'manualUrl',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
            urlMode: ['manual'],
          },
        },
        default: 'https://api.cometapi.com/v1/chat/completions',
        required: true,
        placeholder: 'https://api.example.com/v1/chat/completions',
        description: 'Complete API endpoint URL including path',
      },

      // 10. HTTP Method (在 manual 模式下)
      {
        displayName: 'HTTP Method',
        name: 'httpMethod',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
            urlMode: ['manual'],
          },
        },
        options: [
          {
            name: 'POST',
            value: 'POST',
          },
          {
            name: 'GET',
            value: 'GET',
          },
          {
            name: 'PUT',
            value: 'PUT',
          },
          {
            name: 'PATCH',
            value: 'PATCH',
          },
        ],
        default: 'POST',
        description: 'HTTP method for the request',
      },

      // 11. Request Body Mode (在 manual 模式下)
      {
        displayName: 'Request Body Mode',
        name: 'requestBodyMode',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
            urlMode: ['manual'],
          },
        },
        options: [
          {
            name: 'Use Form Fields',
            value: 'form',
            description: 'Use the standard message and system fields',
          },
          {
            name: 'Custom JSON',
            value: 'json',
            description: 'Provide completely custom JSON request body',
          },
          {
            name: 'Merge Fields with JSON',
            value: 'merge',
            description: 'Merge form fields with custom JSON (JSON overrides)',
          },
        ],
        default: 'json',
        description: 'How to construct the request body in manual mode',
      },

      // 12. 自定义 JSON 请求体字段
      {
        displayName: 'Custom Request Body (JSON)',
        name: 'customRequestBody',
        type: 'json',
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
            urlMode: ['manual'],
            requestBodyMode: ['json', 'merge'],
          },
        },
        default: '{\n  "model": "gpt-3.5-turbo",\n  "messages": [\n    {\n      "role": "user",\n      "content": "Hello!"\n    }\n  ],\n  "max_tokens": 150,\n  "temperature": 0.7\n}',
        description: 'Custom JSON request body. You can use n8n expressions like {{ $json.message }}',
        typeOptions: {
          rows: 12,
        },
        required: true,
      },

      // 13. Custom Model Name
      {
        displayName: 'Custom Model Name',
        name: 'customModel',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
            model: ['custom'],
            urlMode: ['auto', 'custom'],
          },
        },
        default: '',
        placeholder: 'your-custom-model-name',
        description: 'Name of the custom model to use',
        required: true,
      },

      // 14. Custom Service URL
      {
        displayName: 'Custom Service URL',
        name: 'customServiceUrl',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
            model: ['custom'],
            urlMode: ['auto', 'custom'],
          },
        },
        default: 'https://api.cometapi.com/v1/chat/completions',
        placeholder: 'https://api.cometapi.com/v1/chat/completions',
        description: 'API endpoint URL for the custom model',
        required: true,
      },

      // 15. Additional Fields
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
          },
        },
        options: [
          {
            displayName: 'Max Tokens',
            name: 'maxTokens',
            type: 'number',
            typeOptions: {
              minValue: 1,
              maxValue: 8192,
            },
            default: 150,
            description: 'Maximum number of tokens to generate',
          },
          {
            displayName: 'Temperature',
            name: 'temperature',
            type: 'number',
            typeOptions: {
              minValue: 0,
              maxValue: 2,
              numberStepSize: 0.1,
            },
            default: 0.7,
            description: 'Controls randomness. Lower values make responses more focused and deterministic.',
          },
          {
            displayName: 'Top P',
            name: 'topP',
            type: 'number',
            typeOptions: {
              minValue: 0,
              maxValue: 1,
              numberStepSize: 0.1,
            },
            default: 1,
            description: 'Controls diversity of responses via nucleus sampling',
          },
          {
            displayName: 'Frequency Penalty',
            name: 'frequencyPenalty',
            type: 'number',
            typeOptions: {
              minValue: -2,
              maxValue: 2,
              numberStepSize: 0.1,
            },
            default: 0,
            description: 'Penalize new tokens based on their existing frequency in the text',
          },
          {
            displayName: 'Presence Penalty',
            name: 'presencePenalty',
            type: 'number',
            typeOptions: {
              minValue: -2,
              maxValue: 2,
              numberStepSize: 0.1,
            },
            default: 0,
            description: 'Penalize new tokens based on whether they appear in the text so far',
          },
        ],
      },

      // 16. Options
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Continue On Fail',
            name: 'continueOnFail',
            type: 'boolean',
            default: false,
            description: 'Continue processing other items if this one fails',
          },
          {
            displayName: 'Debug Mode',
            name: 'debugMode',
            type: 'boolean',
            default: false,
            description: 'Enable detailed logging for debugging',
          },
          {
            displayName: 'Show URL Mapping',
            name: 'showUrlMapping',
            type: 'boolean',
            default: false,
            description: 'Show which URL was selected for the model in debug output',
          },
          {
            displayName: 'Validate JSON',
            name: 'validateJson',
            type: 'boolean',
            default: true,
            description: 'Validate custom JSON syntax before sending request',
          },
          {
            displayName: 'Timeout (seconds)',
            name: 'timeout',
            type: 'number',
            typeOptions: {
              minValue: 1,
              maxValue: 300,
            },
            default: 30,
            description: 'Request timeout in seconds',
          },
        ],
      },
    ],
  };




  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      let options: IDataObject = {};
      try {
        options = this.getNodeParameter('options', i, {}) as IDataObject;
      } catch {
        options = {};
      }

      try {
        if (resource === 'chat' && operation === 'sendMessage') {
          // 获取基础参数
          const apiKey = this.getNodeParameter('apiKey', i) as string;
          const urlMode = this.getNodeParameter('urlMode', i) as string;

          // 验证 API Key
          if (!apiKey?.trim()) {
            throw new NodeOperationError(this.getNode(), 'API Key is required.', { itemIndex: i });
          }

          // 🎯 Manual 模式的特殊处理
          if (urlMode === 'manual') {
            const finalUrl = this.getNodeParameter('manualUrl', i) as string;
            const httpMethod = this.getNodeParameter('httpMethod', i, 'POST') as string;
            const requestBodyMode = this.getNodeParameter('requestBodyMode', i, 'json') as string;

            let requestBody: IDataObject = {};
            let actualModelName = 'manual-mode';

            // 🔥 根据请求体模式构建请求
            if (requestBodyMode === 'json') {
              // 纯自定义 JSON 模式
              const customRequestBodyStr = this.getNodeParameter('customRequestBody', i) as string;

              if (!customRequestBodyStr?.trim()) {
                throw new NodeOperationError(
                  this.getNode(),
                  'Custom Request Body is required in JSON mode.',
                  { itemIndex: i }
                );
              }

              try {
                // 解析 JSON
                requestBody = JSON.parse(customRequestBodyStr);
                actualModelName = (requestBody.model as string) || 'custom-json';

                // JSON 验证（可选）
                if (options.validateJson && typeof requestBody !== 'object') {
                  throw new Error('Request body must be a valid JSON object');
                }

              } catch (jsonError) {
                throw new NodeOperationError(
                  this.getNode(),
                  `Invalid JSON in Custom Request Body: ${(jsonError as Error).message}. Please check your JSON syntax.`,
                  { itemIndex: i }
                );
              }

            } else if (requestBodyMode === 'merge') {
              // 合并模式：先构建标准请求，然后与自定义 JSON 合并
              const message = this.getNodeParameter('message', i, '') as string;
              const systemMessage = this.getNodeParameter('systemMessage', i, '') as string;
              const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

              // 🔧 在合并模式下，message 是可选的，因为可能通过 JSON 提供
              const messages: IDataObject[] = [];
              if (systemMessage.trim()) {
                messages.push({ role: 'system', content: systemMessage.trim() });
              }
              if (message.trim()) {
                messages.push({ role: 'user', content: message.trim() });
              }

              // 基础请求体（只有在有消息时才添加）
              requestBody = {
                model: 'gpt-3.5-turbo',
              };

              if (messages.length > 0) {
                requestBody.messages = messages;
              }

              if (additionalFields.maxTokens) requestBody.max_tokens = additionalFields.maxTokens;
              if (additionalFields.temperature !== undefined) requestBody.temperature = additionalFields.temperature;
              if (additionalFields.topP !== undefined) requestBody.top_p = additionalFields.topP;
              if (additionalFields.frequencyPenalty !== undefined) requestBody.frequency_penalty = additionalFields.frequencyPenalty;
              if (additionalFields.presencePenalty !== undefined) requestBody.presence_penalty = additionalFields.presencePenalty;

              // 解析并合并自定义 JSON
              const customRequestBodyStr = this.getNodeParameter('customRequestBody', i, '') as string;
              if (customRequestBodyStr.trim()) {
                try {
                  const customJson = JSON.parse(customRequestBodyStr);
                  // 合并（自定义 JSON 优先）
                  requestBody = { ...requestBody, ...customJson };
                } catch (jsonError) {
                  throw new NodeOperationError(
                    this.getNode(),
                    `Invalid JSON in Custom Request Body: ${(jsonError as Error).message}`,
                    { itemIndex: i }
                  );
                }
              }

              actualModelName = (requestBody.model as string) || 'merged';

            } else {
              // form 模式：使用标准字段
              const message = this.getNodeParameter('message', i, '') as string;
              const systemMessage = this.getNodeParameter('systemMessage', i, '') as string;
              const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

              // 🔧 在 form 模式下验证 message 是必需的
              if (!message?.trim()) {
                throw new NodeOperationError(this.getNode(), 'Message is required in form mode.', { itemIndex: i });
              }

              // 构建标准请求
              const messages: IDataObject[] = [];
              if (systemMessage.trim()) {
                messages.push({ role: 'system', content: systemMessage.trim() });
              }
              messages.push({ role: 'user', content: message.trim() });

              requestBody = {
                model: 'gpt-3.5-turbo',
                messages,
              };

              if (additionalFields.maxTokens) requestBody.max_tokens = additionalFields.maxTokens;
              if (additionalFields.temperature !== undefined) requestBody.temperature = additionalFields.temperature;
              if (additionalFields.topP !== undefined) requestBody.top_p = additionalFields.topP;
              if (additionalFields.frequencyPenalty !== undefined) requestBody.frequency_penalty = additionalFields.frequencyPenalty;
              if (additionalFields.presencePenalty !== undefined) requestBody.presence_penalty = additionalFields.presencePenalty;

              actualModelName = requestBody.model as string;
            }

            // 调试信息
            if (options.debugMode || options.showUrlMapping) {
              this.logger.info('=== Manual Override Mode Debug ===');
              this.logger.info(`URL: ${finalUrl}`);
              this.logger.info(`HTTP Method: ${httpMethod}`);
              this.logger.info(`Request Body Mode: ${requestBodyMode}`);
              this.logger.info(`Model: ${actualModelName}`);
            }

            if (options.debugMode) {
              this.logger.info(`Final Request Body: ${JSON.stringify(requestBody, null, 2)}`);
            }

            const requestOptions = {
              method: httpMethod,
              url: finalUrl,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'User-Agent': 'n8n-comet-api/1.0',
              },
              body: httpMethod !== 'GET' ? requestBody : undefined,
              json: true,
              timeout: (options.timeout as number || 30) * 1000,
            };

            // 发送请求并处理响应
            let responseData: any;

            try {
              responseData = await this.helpers.request(requestOptions);

              if (options.debugMode) {
                this.logger.info(`Response received: ${JSON.stringify(responseData, null, 2)}`);
              }

              // 检查 API 错误
              if (responseData.error) {
                throw new NodeOperationError(
                  this.getNode(),
                  `API Error: ${responseData.error.message || JSON.stringify(responseData.error)}`,
                  { itemIndex: i }
                );
              }

              // 🔍 通用响应处理（尝试多种格式）
              let content = '';
              let usage = {};

              // 尝试不同的响应格式
              if (responseData.choices && responseData.choices.length > 0) {
                // OpenAI 格式
                content = responseData.choices[0].message?.content || responseData.choices[0].text || '';
              } else if (responseData.content && Array.isArray(responseData.content)) {
                // Anthropic 格式
                content = responseData.content[0]?.text || '';
              } else if (responseData.data && Array.isArray(responseData.data)) {
                // 图片生成等格式
                content = JSON.stringify(responseData.data);
              } else if (typeof responseData === 'string') {
                content = responseData;
              } else if (responseData.result || responseData.response) {
                // 通用结果字段
                content = responseData.result || responseData.response;
              } else if (responseData.text) {
                // 直接文本字段
                content = responseData.text;
              } else {
                // 如果找不到标准字段，返回整个响应
                content = JSON.stringify(responseData);
              }

              usage = responseData.usage || {};

              const resultData: IDataObject = {
                message: content,
                model: actualModelName,
                service: 'Manual Override',
                api_format: 'custom',
                final_url: finalUrl,
                http_method: httpMethod,
                request_body_mode: requestBodyMode,
                usage,
                raw_response: options.debugMode ? responseData : undefined,
              };

              returnData.push({
                json: resultData,
                pairedItem: { item: i },
              });

            } catch (error) {
              const err = error as any;
              let errorMessage = 'Unknown error occurred';




								              if (err.code === 'ENOTFOUND') {
                errorMessage = `Could not connect to API endpoint: ${finalUrl}. Please verify the URL.`;
              } else if (err.statusCode === 400) {
                errorMessage = `Bad Request (400): ${err.response?.body?.error?.message || 'Invalid request format or parameters'}`;
              } else if (err.statusCode === 401) {
                errorMessage = 'Authentication failed (401). Please check your API key.';
              } else if (err.statusCode === 403) {
                errorMessage = 'Access forbidden (403). Please check your API key permissions.';
              } else if (err.statusCode === 404) {
                errorMessage = `API endpoint not found (404): ${finalUrl}. Please verify the endpoint URL.`;
              } else if (err.statusCode === 422) {
                errorMessage = `Unprocessable Entity (422): ${err.response?.body?.error?.message || 'Invalid parameters in request body'}`;
              } else if (err.statusCode === 429) {
                errorMessage = 'Rate limit exceeded (429). Please try again later.';
              } else if (err.statusCode && err.statusCode >= 500) {
                errorMessage = `Server error (${err.statusCode}). Please try again later.`;
              } else if (err.message) {
                errorMessage = err.message;
              }

              if (options.continueOnFail) {
                returnData.push({
                  json: {
                    error: errorMessage,
                    statusCode: err.statusCode || 'N/A',
                    url: finalUrl,
                    model: actualModelName,
                    service: 'Manual Override',
                    request_body: options.debugMode ? requestBody : undefined,
                  },
                  pairedItem: { item: i },
                });
                continue;
              }

              throw new NodeOperationError(this.getNode(), errorMessage, { itemIndex: i });
            }

          } else {
            // 🔄 自动和自定义模式的原有逻辑
            const modelSelection = this.getNodeParameter('model', i) as string;
            const message = this.getNodeParameter('message', i, '') as string;
            const systemMessage = this.getNodeParameter('systemMessage', i, '') as string;
            const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

            // 🔧 在非 manual 模式下，message 是必需的
            if (!message?.trim()) {
              throw new NodeOperationError(this.getNode(), 'Message is required.', { itemIndex: i });
            }

            // 🎯 智能URL解析逻辑
            let finalUrl: string;
            let actualModelName: string;
            let apiFormat: 'openai' | 'anthropic' | 'custom';
            let modelConfig: ReturnType<typeof getModelConfiguration>;

            if (urlMode === 'custom') {
              // 自定义基础URL模式
              const baseUrl = this.getNodeParameter('baseUrl', i) as string;
              if (modelSelection === 'custom') {
                actualModelName = this.getNodeParameter('customModel', i) as string;
                finalUrl = this.getNodeParameter('customServiceUrl', i) as string;
                apiFormat = 'custom';
                modelConfig = { modelName: actualModelName, baseUrl, endpoint: '', apiFormat: 'custom' };
              } else {
                modelConfig = getModelConfiguration(modelSelection);
                actualModelName = modelConfig.modelName;
                apiFormat = modelConfig.apiFormat;
                finalUrl = `${baseUrl.replace(/\/$/, '')}${modelConfig.endpoint}`;
              }
            } else {
              // 自动模式：根据模型智能选择
              if (modelSelection === 'custom') {
                actualModelName = this.getNodeParameter('customModel', i) as string;
                finalUrl = this.getNodeParameter('customServiceUrl', i) as string;
                apiFormat = 'custom';
                modelConfig = { modelName: actualModelName, baseUrl: '', endpoint: '', apiFormat: 'custom' };
              } else {
                modelConfig = getModelConfiguration(modelSelection);
                actualModelName = modelConfig.modelName;
                apiFormat = modelConfig.apiFormat;
                finalUrl = `${modelConfig.baseUrl}${modelConfig.endpoint}`;
              }
            }

            // 构建消息数组
            const messages: IDataObject[] = [];
            if (systemMessage.trim()) {
              messages.push({ role: 'system', content: systemMessage.trim() });
            }
            messages.push({ role: 'user', content: message.trim() });

            // 🔧 根据API格式构建请求体
            let requestBody: IDataObject;
            let requestHeaders: IDataObject = {
              'Content-Type': 'application/json',
              'User-Agent': 'n8n-comet-api/1.0',
            };

            if (apiFormat === 'anthropic') {
              // Anthropic Claude API 格式
              requestBody = {
                model: actualModelName,
                max_tokens: additionalFields.maxTokens || modelConfig.defaultMaxTokens || 4096,
                messages: messages.filter(m => m.role !== 'system'),
              };

              // Claude 的 system message 单独处理
              const systemMsg = messages.find(m => m.role === 'system');
              if (systemMsg) {
                requestBody.system = systemMsg.content;
              }

              requestHeaders['Authorization'] = `Bearer ${apiKey}`;
              requestHeaders['anthropic-version'] = '2023-06-01';

              if (additionalFields.temperature !== undefined) {
                requestBody.temperature = additionalFields.temperature;
              }
              if (additionalFields.topP !== undefined) {
                requestBody.top_p = additionalFields.topP;
              }
            } else {
              // OpenAI 兼容格式 (默认)
              requestBody = {
                model: actualModelName,
                messages,
              };

              requestHeaders['Authorization'] = `Bearer ${apiKey}`;

              if (additionalFields.maxTokens) {
                requestBody.max_tokens = additionalFields.maxTokens;
              }
              if (additionalFields.temperature !== undefined) {
                requestBody.temperature = additionalFields.temperature;
              }
              if (additionalFields.topP !== undefined) {
                requestBody.top_p = additionalFields.topP;
              }
              if (additionalFields.frequencyPenalty !== undefined) {
                requestBody.frequency_penalty = additionalFields.frequencyPenalty;
              }
              if (additionalFields.presencePenalty !== undefined) {
                requestBody.presence_penalty = additionalFields.presencePenalty;
              }
            }

            // 调试信息
            if (options.debugMode || options.showUrlMapping) {
              this.logger.info('=== Smart URL Mapping Debug ===');
              this.logger.info(`URL Mode: ${urlMode}`);
              this.logger.info(`Model Selection: ${modelSelection}`);
              this.logger.info(`Final URL: ${finalUrl}`);
              this.logger.info(`Actual Model: ${actualModelName}`);
              this.logger.info(`API Format: ${apiFormat}`);
              this.logger.info(`Service: ${modelConfig.baseUrl || 'Custom'}`);
            }

            if (options.debugMode) {
              this.logger.info(`Headers: ${JSON.stringify(requestHeaders, null, 2)}`);
              this.logger.info(`Request Body: ${JSON.stringify(requestBody, null, 2)}`);
            }

            const requestOptions = {
              method: 'POST',
              url: finalUrl,
              headers: requestHeaders,
              body: requestBody,
              json: true,
              timeout: (options.timeout as number || 30) * 1000,
            };

            let responseData: any;

            try {
              responseData = await this.helpers.request(requestOptions);

              if (options.debugMode) {
                this.logger.info(`Response received: ${JSON.stringify(responseData, null, 2)}`);
              }

              // 检查 API 错误
              if (responseData.error) {
                throw new NodeOperationError(
                  this.getNode(),
                  `API Error: ${responseData.error.message || JSON.stringify(responseData.error)}`,
                  { itemIndex: i }
                );
              }

              // 🔍 智能响应解析
              let content = '';
              let usage = {};

              if (apiFormat === 'anthropic') {
                // Claude 响应格式
                if (responseData.content && responseData.content.length > 0) {
                  content = responseData.content[0].text || '';
                }
                usage = responseData.usage || {};
              } else {
                // OpenAI 格式响应
                if (responseData.choices && responseData.choices.length > 0) {
                  content = responseData.choices[0].message?.content || responseData.choices[0].text || '';
                }
                usage = responseData.usage || {};
              }

              const resultData: IDataObject = {
                message: content,
                model: actualModelName,
                service: modelConfig.baseUrl || 'Custom',
                api_format: apiFormat,
                final_url: finalUrl,
                usage,
                raw_response: options.debugMode ? responseData : undefined,
              };

              returnData.push({
                json: resultData,
                pairedItem: { item: i },
              });

            } catch (error) {
              const err = error as any;
              let errorMessage = 'Unknown error occurred';

              // 增强错误处理
              if (err.code === 'ENOTFOUND') {
                errorMessage = `Could not connect to API endpoint: ${finalUrl}. Please verify the URL.`;
              } else if (err.statusCode === 400) {
                errorMessage = `Bad Request (400): ${err.response?.body?.error?.message || 'Invalid request format'}`;
              } else if (err.statusCode === 401) {
                errorMessage = 'Authentication failed (401). Please check your API key.';
              } else if (err.statusCode === 403) {
                errorMessage = 'Access forbidden (403). Please check your API key permissions.';
              } else if (err.statusCode === 404) {
                errorMessage = `API endpoint not found (404): ${finalUrl}. Please verify the endpoint.`;
              } else if (err.statusCode === 422) {
                errorMessage = `Unprocessable Entity (422): ${err.response?.body?.error?.message || 'Invalid parameters'}`;
              } else if (err.statusCode === 429) {
                errorMessage = 'Rate limit exceeded (429). Please try again later.';
              } else if (err.statusCode && err.statusCode >= 500) {
                errorMessage = `Server error (${err.statusCode}). Please try again later.`;
              } else if (err.message) {
                errorMessage = err.message;
              }

              if (options.continueOnFail) {
                returnData.push({
                  json: {
                    error: errorMessage,
                    statusCode: err.statusCode || 'N/A',
                    url: finalUrl,
                    model: actualModelName,
                    service: modelConfig.baseUrl || 'Custom',
                  },
                  pairedItem: { item: i },
                });
                continue;
              }

              throw new NodeOperationError(this.getNode(), errorMessage, { itemIndex: i });
            }
          }
        }
      } catch (error) {
        const outerErr = error as any;
        if (options.continueOnFail) {
          returnData.push({
            json: {
              error: outerErr.message || 'Unknown error',
              statusCode: outerErr.statusCode || 'N/A',
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
