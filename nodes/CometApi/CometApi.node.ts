// 🔧 仅使用 n8n 内置类型，无外部依赖
import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  NodeOperationError,
  IExecuteFunctions
} from 'n8n-workflow';

// 🔧 将所有辅助函数内联，避免外部模块
function getModelConfiguration(modelSelection: string): {
  modelName: string;
  baseUrl: string;
  endpoint: string;
  apiFormat: 'openai' | 'anthropic' | 'custom';
  defaultMaxTokens?: number;
} {
  const modelConfigs: Record<string, any> = {
    'openai-gpt-3.5-turbo': {
      modelName: 'gpt-3.5-turbo',
      baseUrl: 'https://api.cometapi.com',
      endpoint: '/v1/chat/completions',
      apiFormat: 'openai',
      defaultMaxTokens: 4096,
    },
    'openai-gpt-4': {
      modelName: 'gpt-4',
      baseUrl: 'https://api.cometapi.com',
      endpoint: '/v1/chat/completions',
      apiFormat: 'openai',
      defaultMaxTokens: 8192,
    },
    'comet-gpt-3.5-turbo': {
      modelName: 'gpt-3.5-turbo',
      baseUrl: 'https://api.cometapi.com',
      endpoint: '/v1/chat/completions',
      apiFormat: 'openai',
      defaultMaxTokens: 4096,
    },
    'comet-gpt-4': {
      modelName: 'gpt-4',
      baseUrl: 'https://api.cometapi.com',
      endpoint: '/v1/chat/completions',
      apiFormat: 'openai',
      defaultMaxTokens: 8192,
    },
    'comet-gpt-5': {
      modelName: 'gpt-5',
      baseUrl: 'https://api.cometapi.com',
      endpoint: '/v1/chat/completions',
      apiFormat: 'openai',
      defaultMaxTokens: 8192,
    },
    'anthropic-claude-3-opus': {
      modelName: 'claude-3-opus-20240229',
      baseUrl: 'https://api.cometapi.com',
      endpoint: '/v1/messages',
      apiFormat: 'anthropic',
      defaultMaxTokens: 4096,
    },
  };

  return modelConfigs[modelSelection] || {
    modelName: modelSelection,
    baseUrl: 'https://api.cometapi.com',
    endpoint: '/v1/chat/completions',
    apiFormat: 'openai',
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
    description: 'Interact with CometAPI and other AI services with smart URL routing',
    defaults: {
      name: 'CometAPI',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      // Resource
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
      },

      // Operation
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
          },
        ],
        default: 'sendMessage',
        noDataExpression: true,
      },

      // API Key
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

      // URL Configuration Mode
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

      // Model Selection
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
          },
          {
            name: 'Anthropic - Claude 3 Opus',
            value: 'anthropic-claude-3-opus',
            description: 'Claude 3 Opus model',
          },
          {
            name: 'Custom Model',
            value: 'custom',
            description: 'Use a custom model name',
          },
        ],
        default: 'comet-gpt-3.5-turbo',
        description: 'Select the AI service and model to use',
      },

      // Message
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
        placeholder: 'Enter your message here... (Ignored in Manual Override JSON mode)',
        description: 'The message to send to the AI model. This field is ignored when using Manual Override with Custom JSON.',
        required: false,
      },

      // System Message
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

      // Custom Base URL
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

      // Manual URL
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

      // HTTP Method
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
          { name: 'POST', value: 'POST' },
          { name: 'GET', value: 'GET' },
          { name: 'PUT', value: 'PUT' },
          { name: 'PATCH', value: 'PATCH' },
        ],
        default: 'POST',
        description: 'HTTP method for the request',
      },

      // Request Body Mode
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
            description: 'Merge form fields with custom JSON',
          },
        ],
        default: 'json',
        description: 'How to construct the request body in manual mode',
      },

      // Custom JSON Body
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

      // Custom Model Name
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

      // Custom Service URL
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

      // Additional Fields
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
            description: 'Controls randomness (0-2)',
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;

        if (resource === 'chat' && operation === 'sendMessage') {
          const apiKey = this.getNodeParameter('apiKey', i) as string;
          const urlMode = this.getNodeParameter('urlMode', i) as string;

          if (!apiKey?.trim()) {
            throw new NodeOperationError(this.getNode(), 'API Key is required.', { itemIndex: i });
          }

          let finalUrl: string;
          let requestBody: IDataObject;
          let actualModelName: string;

          if (urlMode === 'manual') {
            finalUrl = this.getNodeParameter('manualUrl', i) as string;
            const httpMethod = this.getNodeParameter('httpMethod', i, 'POST') as string;
            const requestBodyMode = this.getNodeParameter('requestBodyMode', i, 'json') as string;

            if (requestBodyMode === 'json') {
              const customRequestBodyStr = this.getNodeParameter('customRequestBody', i) as string;
              if (!customRequestBodyStr?.trim()) {
                throw new NodeOperationError(this.getNode(), 'Custom Request Body is required in JSON mode.', { itemIndex: i });
              }

              try {
                requestBody = JSON.parse(customRequestBodyStr);
                actualModelName = (requestBody.model as string) || 'custom-json';
              } catch (jsonError) {
                throw new NodeOperationError(this.getNode(), `Invalid JSON: ${(jsonError as Error).message}`, { itemIndex: i });
              }
            } else {
              // Form mode
              const message = this.getNodeParameter('message', i, '') as string;
              const systemMessage = this.getNodeParameter('systemMessage', i, '') as string;

              if (!message?.trim()) {
                throw new NodeOperationError(this.getNode(), 'Message is required in form mode.', { itemIndex: i });
              }

              const messages: IDataObject[] = [];
              if (systemMessage.trim()) {
                messages.push({ role: 'system', content: systemMessage.trim() });
              }
              messages.push({ role: 'user', content: message.trim() });

              requestBody = {
                model: 'gpt-3.5-turbo',
                messages,
              };
              actualModelName = 'gpt-3.5-turbo';
            }
          } else {
            // Auto/Custom mode
            const message = this.getNodeParameter('message', i, '') as string;
            const systemMessage = this.getNodeParameter('systemMessage', i, '') as string;
            const modelSelection = this.getNodeParameter('model', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

            if (!message?.trim()) {
              throw new NodeOperationError(this.getNode(), 'Message is required.', { itemIndex: i });
            }

            let modelConfig: ReturnType<typeof getModelConfiguration>;

            if (urlMode === 'custom') {
              const baseUrl = this.getNodeParameter('baseUrl', i) as string;
              if (modelSelection === 'custom') {
                actualModelName = this.getNodeParameter('customModel', i) as string;
                finalUrl = this.getNodeParameter('customServiceUrl', i) as string;
              } else {
                modelConfig = getModelConfiguration(modelSelection);
                actualModelName = modelConfig.modelName;
                finalUrl = `${baseUrl.replace(/\/$/, '')}${modelConfig.endpoint}`;
              }
            } else {
              // Auto mode
              if (modelSelection === 'custom') {
                actualModelName = this.getNodeParameter('customModel', i) as string;
                finalUrl = this.getNodeParameter('customServiceUrl', i) as string;
              } else {
                modelConfig = getModelConfiguration(modelSelection);
                actualModelName = modelConfig.modelName;
                finalUrl = `${modelConfig.baseUrl}${modelConfig.endpoint}`;
              }
            }

            // Build messages
            const messages: IDataObject[] = [];
            if (systemMessage.trim()) {
              messages.push({ role: 'system', content: systemMessage.trim() });
            }
            messages.push({ role: 'user', content: message.trim() });

            requestBody = {
              model: actualModelName,
              messages,
            };

            // Add additional fields
            if (additionalFields.maxTokens) {
              requestBody.max_tokens = additionalFields.maxTokens;
            }
            if (additionalFields.temperature !== undefined) {
              requestBody.temperature = additionalFields.temperature;
            }
          }

          // Make API request
          const requestOptions = {
            method: 'POST',
            url: finalUrl,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: requestBody,
            json: true,
          };

          const responseData = await this.helpers.request(requestOptions);

          // Parse response
          let content = '';
          if (responseData?.choices?.[0]?.message?.content) {
            content = responseData.choices[0].message.content;
          } else if (responseData?.content?.[0]?.text) {
            content = responseData.content[0].text;
          } else if (typeof responseData === 'string') {
            content = responseData;
          } else {
            content = JSON.stringify(responseData);
          }

          returnData.push({
            json: {
              message: content || '',
              model: actualModelName || 'unknown',
              service: urlMode === 'manual' ? 'Manual Override' : 'Auto',
              usage: responseData?.usage || {},
            },
            pairedItem: { item: i },
          });
        }
      } catch (error) {
        const err = error as any;
        throw new NodeOperationError(this.getNode(), err.message || 'Unknown error occurred', { itemIndex: i });
      }
    }

    return [returnData];
  }
}
