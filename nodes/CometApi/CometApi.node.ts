import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  NodeOperationError,
  IExecuteFunctions
} from 'n8n-workflow';

export class CometApi implements INodeType {
   description: INodeTypeDescription = {
    displayName: 'CometAPI',
    name: 'cometAPI',
    icon: 'file:cometApi.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Interact with CometAPI',
    defaults: {
      name: 'CometAPI',
    },
    inputs: ['main'],
    outputs: ['main'],
    requestDefaults: {
      headers: {
        'Authorization': 'Bearer {{$parameter.apiKey}}',
        'Content-Type': 'application/json',
      },
    },
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
        description: 'The resource to operate on',
      },
      // API Key
      {
        displayName: 'API Key',
        name: 'apiKey',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        required: true,
        description: 'Your Comet API Key',
      },
      {
        displayName: 'Base URL',
        name: 'baseUrl',
        type: 'string',
        default: 'https://api.cometapi.com',
        required: true,
        description: 'Base URL of the Comet API',
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
            action: 'Send a message to chat model',
          },
        ],
        default: 'sendMessage',
        noDataExpression: true,
      },
      // Model Selection
      {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
          },
        },
        options: [
          {
            name: 'GPT-3.5 Turbo',
            value: 'gpt-3.5-turbo',
          },
          {
            name: 'GPT-4',
            value: 'gpt-4',
          },
					{
            name: 'GPT-5',
            value: 'gpt-5',
          },
        ],
        default: 'gpt-3.5-turbo',
        description: 'The AI model to use for the chat',
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
          },
        },
        default: '',
        placeholder: 'your-custom-model-name',
        description: 'Name of the custom model to use',
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
        placeholder: 'Enter your message here...',
        description: 'The message to send to the AI model',
        required: true,
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
              maxValue: 4000,
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
          {
            displayName: 'Custom API Endpoint',
            name: 'customEndpoint',
            type: 'string',
            default: '',
            placeholder: 'https://api.cometapi.com/v1/chat/completions',
            description: 'Custom API endpoint URL (overrides default)',
          },
        ],
      },
      // Options
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
      // 在循环开始获取options，确保外层catch也能访问
      let options: IDataObject = {};
      try {
        options = this.getNodeParameter('options', i, {}) as IDataObject;
      } catch {
        // 如果获取options失败，使用空对象
        options = {};
      }

      try {
        if (resource === 'chat' && operation === 'sendMessage') {
          // 直接从节点参数获取 API Key 和 Base URL
          const apiKey = this.getNodeParameter('apiKey', i) as string;

          // 验证 API Key
          if (!apiKey || !apiKey.trim()) {
            throw new NodeOperationError(
              this.getNode(),
              'API Key is required. Please provide your Comet API Key.',
              { itemIndex: i }
            );
          }

          // 获取参数
          const model = this.getNodeParameter('model', i) as string;
          const customModel = this.getNodeParameter('customModel', i, '') as string;
          const message = this.getNodeParameter('message', i) as string;
          const systemMessage = this.getNodeParameter('systemMessage', i, '') as string;
          const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

          // 验证必填字段
          if (!message.trim()) {
            throw new NodeOperationError(
              this.getNode(),
              'Message is required and cannot be empty',
              { itemIndex: i }
            );
          }

          // 确定使用的模型
          const modelName = model === 'custom' ? customModel : model;
          if (!modelName) {
            throw new NodeOperationError(
              this.getNode(),
              'Model name is required. Please select a model or provide a custom model name.',
              { itemIndex: i }
            );
          }

          // 构建消息数组
          const messages: IDataObject[] = [];

          if (systemMessage.trim()) {
            messages.push({
              role: 'system',
              content: systemMessage.trim(),
            });
          }

          messages.push({
            role: 'user',
            content: message.trim(),
          });

          // 构建请求体
          const requestBody: IDataObject = {
            model: modelName,
            messages,
          };

          // 添加可选参数
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

          // 确定API端点
          const customEndpoint = additionalFields.customEndpoint as string;
          const baseUrl = this.getNodeParameter('baseUrl', i) as string;
          const apiUrl = customEndpoint || `${baseUrl}/v1/chat/completions`;

          // 调试日志
          if (options.debugMode) {
            this.logger.info('=== Comet API Debug Info ===');
            this.logger.info(`API URL: ${apiUrl}`);
            this.logger.info(`API Key (masked): ${apiKey.substring(0, 8)}...`);
            this.logger.info(`Model: ${modelName}`);
            this.logger.info(`Messages: ${JSON.stringify(messages, null, 2)}`);
            this.logger.info(`Request Body: ${JSON.stringify(requestBody, null, 2)}`);
          }

          // 修复点1: 完全移除 OptionsWithUri 类型声明
          const requestOptions = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'User-Agent': 'n8n-comet-api/1.0',
            },
            method: 'POST',
            body: requestBody,
            url: apiUrl,
            json: true,
            timeout: (options.timeout as number || 30) * 1000,
          };

          let responseData: any;

          try {
            // 发送请求
            responseData = await this.helpers.request(requestOptions);

            // 调试日志
            if (options.debugMode) {
              this.logger.info(`Raw Response: ${JSON.stringify(responseData, null, 2)}`);
            }

            // 检查响应格式
            if (typeof responseData === 'string') {
              throw new NodeOperationError(
                this.getNode(),
                `API returned unexpected response format. Expected JSON but received: ${responseData.substring(0, 200)}...`,
                { itemIndex: i }
              );
            }

            // 检查是否包含错误
            if (responseData.error) {
              throw new NodeOperationError(
                this.getNode(),
                `API Error: ${responseData.error.message || 'Unknown error'}`,
                { itemIndex: i }
              );
            }

            // 提取响应内容
            let content = '';
            if (responseData.choices && responseData.choices.length > 0) {
              content = responseData.choices[0].message?.content || responseData.choices[0].text || '';
            }

            // 构建返回数据
            const resultData: IDataObject = {
              message: content,
              model: modelName,
              usage: responseData.usage || {},
              raw_response: responseData,
            };

            returnData.push({
              json: resultData,
              pairedItem: { item: i },
            });

          } catch (error) {
            if (options.debugMode) {
              this.logger.error(`Request failed: ${error}`);
            }

            // 详细错误处理
            const err = error as any;
            let errorMessage = 'Unknown error occurred';

            if (err.code === 'ENOTFOUND') {
              errorMessage = 'Could not connect to API endpoint. Please check the URL.';
            } else if (err.code === 'ETIMEDOUT') {
              errorMessage = 'Request timed out. Consider increasing the timeout value.';
            } else if (err.statusCode === 401) {
              errorMessage = 'Authentication failed. Please check your API key.';
            } else if (err.statusCode === 403) {
              errorMessage = 'Access forbidden. Please check your API key permissions.';
            } else if (err.statusCode === 429) {
              errorMessage = 'Rate limit exceeded. Please try again later.';
            } else if (err.statusCode && err.statusCode >= 500) {
              errorMessage = 'Server error. Please try again later.';
            } else if (err.message) {
              errorMessage = err.message;
            }

            if (options.continueOnFail) {
              returnData.push({
                json: {
                  error: errorMessage,
                  statusCode: err.statusCode || 'N/A',
                },
                pairedItem: { item: i },
              });
              continue;
            }

            throw new NodeOperationError(
              this.getNode(),
              errorMessage,
              { itemIndex: i }
            );
          }
        }
      } catch (error) {
        // 修复点2: 确保正确使用转换后的 error 对象
        const outerErr = error as any;

        // 修复点3: 确保 options 变量在作用域内
        if (options.continueOnFail) {
          returnData.push({
            json: {
              // 使用转换后的 outerErr 而不是原始的 error
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
