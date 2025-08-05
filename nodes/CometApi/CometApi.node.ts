import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

export class CometApi implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'CometApi',
        name: 'cometApi',
        icon: 'fa:robot',
        group: ['AI'],
        version: 1,
        description: 'Call CometApi AI models',
        defaults: {
            name: 'CometApi',
        },
        inputs: ['main'] as any,
        outputs: ['main'] as any,
        credentials: [
            {
                name: 'cometApiApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        name: 'Chat Completion',
                        value: 'chat',
                        description: 'Generate chat completion',
                    },
                    {
                        name: 'List Models',
                        value: 'models',
                        description: 'List available models',
                    },
                ],
                default: 'chat',
            },
            {
                displayName: 'Prompt',
                name: 'prompt',
                type: 'string',
                typeOptions: {
                    rows: 4,
                },
                displayOptions: {
                    show: {
                        operation: ['chat'],
                    },
                },
                default: '',
                placeholder: 'Enter your prompt...',
                description: 'The prompt to send to CometApi',
            },
            {
                displayName: 'Model',
                name: 'model',
                type: 'options',
                displayOptions: {
                    show: {
                        operation: ['chat'],
                    },
                },
                options: [
                    { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
                    { name: 'GPT-4', value: 'gpt-4' },
                    { name: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
                    { name: 'GPT-4o', value: 'gpt-4o' },
                    { name: 'GPT-4o Mini', value: 'gpt-4o-mini' },
                    { name: 'Claude-3 Sonnet', value: 'claude-3-sonnet-20240229' },
                    { name: 'Claude-3 Haiku', value: 'claude-3-haiku-20240307' },
                    { name: 'Claude-3.5 Sonnet', value: 'claude-3-5-sonnet-20240620' },
                    { name: 'Gemini Pro', value: 'gemini-pro' },
                    { name: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro-latest' },
                ],
                default: 'gpt-3.5-turbo',
                description: 'Model to use',
            },
            {
                displayName: 'Max Tokens',
                name: 'maxTokens',
                type: 'number',
                displayOptions: {
                    show: {
                        operation: ['chat'],
                    },
                },
                default: 1000,
                typeOptions: {
                    minValue: 1,
                    maxValue: 4000,
                },
                description: 'Maximum number of tokens to generate',
            },
            {
                displayName: 'Temperature',
                name: 'temperature',
                type: 'number',
                displayOptions: {
                    show: {
                        operation: ['chat'],
                    },
                },
                default: 0.7,
                typeOptions: {
                    minValue: 0,
                    maxValue: 2,
                    numberPrecision: 2,
                },
                description: 'Controls randomness (0=deterministic, 2=very random)',
            },
            {
                displayName: 'System Message (Optional)',
                name: 'systemMessage',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['chat'],
                    },
                },
                default: '',
                placeholder: 'You are a helpful assistant...',
                description: 'System message to set the AI behavior',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const credentials = await this.getCredentials('cometApiApi');

        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter('operation', i) as string;
            
            try {
                // 初始化所有变量
                let endpoint = '';
                let method: 'GET' | 'POST' = 'GET';
                let requestBody: any = {};

                // 根据操作类型设置参数
                if (operation === 'models') {
                    endpoint = '/models';
                    method = 'GET';
                } else if (operation === 'chat') {
                    endpoint = '/chat/completions';
                    method = 'POST';
                    
                    const prompt = this.getNodeParameter('prompt', i) as string;
                    const model = this.getNodeParameter('model', i) as string;
                    const maxTokens = this.getNodeParameter('maxTokens', i) as number;
                    const temperature = this.getNodeParameter('temperature', i) as number;
                    const systemMessage = this.getNodeParameter('systemMessage', i, '') as string;

                    // 构建消息数组
                    const messages: any[] = [];
                    
                    if (systemMessage && systemMessage.trim()) {
                        messages.push({ role: 'system', content: systemMessage.trim() });
                    }
                    
                    messages.push({ role: 'user', content: prompt });

                    requestBody = {
                        model: model,
                        messages: messages,
                        max_tokens: maxTokens,
                        temperature: temperature,
                    };
                } else {
                    // 处理未知操作
                    throw new Error(`Unknown operation: ${operation}`);
                }

                // 验证端点已设置
                if (!endpoint) {
                    throw new Error(`Endpoint not set for operation: ${operation}`);
                }

                // 准备请求头
                const headers = {
                    'Authorization': `Bearer ${credentials.apiKey}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'n8n-cometapi-node/1.0',
                    'Accept': 'application/json'
                };

                // 发送请求
                const requestOptions: any = {
                    method,
                    baseURL: 'https://api.cometapi.com',
                    url: endpoint,
                    headers,
                    json: true,
                    timeout: 60000, // 60秒超时
                };

                if (method === 'POST') {
                    requestOptions.body = requestBody;
                }

                console.log(`CometApi Request: ${method} https://api.cometapi.com${endpoint}`);
                if (method === 'POST') {
                    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
                }

                const response = await this.helpers.httpRequest(requestOptions);

                console.log('CometApi Response keys:', Object.keys(response || {}));
                console.log('Response type:', typeof response);

                // 处理响应
                let result: any = {};
                
                if (operation === 'models') {
                    // Models 响应处理
                    const models = response?.data || response?.models || (Array.isArray(response) ? response : []);
                    result = {
                        operation: 'models',
                        models: models,
                        totalModels: Array.isArray(models) ? models.length : 0,
                        timestamp: new Date().toISOString(),
                        success: true,
                    };
                    
                } else if (operation === 'chat') {
                    // Chat 响应处理
                    let content = '';
                    let finishReason = '';
                    let usage = null;
                    
                    try {
                        // 尝试各种可能的响应结构
                        if (response && typeof response === 'object') {
                            // 标准 OpenAI 格式
                            if (response.choices && Array.isArray(response.choices) && response.choices.length > 0) {
                                const choice = response.choices[0];
                                
                                if (choice.message && typeof choice.message.content === 'string') {
                                    content = choice.message.content;
                                    finishReason = choice.finish_reason || '';
                                } else if (typeof choice.text === 'string') {
                                    content = choice.text;
                                } else if (typeof choice === 'string') {
                                    content = choice;
                                }
                            }
                            // 其他可能的格式
                            else if (typeof response.content === 'string') {
                                content = response.content;
                            } else if (typeof response.text === 'string') {
                                content = response.text;
                            } else if (response.message && typeof response.message === 'string') {
                                content = response.message;
                            } else if (response.message && typeof response.message.content === 'string') {
                                content = response.message.content;
                            }
                            
                            // 提取使用统计
                            usage = response.usage || null;
                        }
                        
                        // 如果仍然没有找到内容
                        if (!content) {
                            content = 'Unable to parse response content';
                            console.warn('CometApi: Could not extract content from response:', response);
                        }
                        
                    } catch (parseError) {
                        content = `Error parsing response: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`;
                        console.error('CometApi response parsing error:', parseError);
                    }
                    
                    result = {
                        operation: 'chat',
                        prompt: requestBody.messages[requestBody.messages.length - 1].content,
                        model: requestBody.model,
                        systemMessage: requestBody.messages.length > 1 ? requestBody.messages[0].content : null,
                        maxTokens: requestBody.max_tokens,
                        temperature: requestBody.temperature,
                        
                        // 输出结果
                        content: content,
                        finishReason: finishReason,
                        usage: usage,
                        
                        // 元数据
                        timestamp: new Date().toISOString(),
                        success: true,
                        responseStructure: {
                            hasChoices: !!(response?.choices),
                            choicesLength: response?.choices ? response.choices.length : 0,
                            responseKeys: response ? Object.keys(response) : [],
                        }
                    };
                }

                returnData.push({
                    json: result,
                    pairedItem: { item: i },
                });

            } catch (error: any) {
                console.error('CometApi Error:', error);
                
                const errorDetails = {
                    message: error?.message || 'Unknown error',
                    status: error?.response?.status || error?.status || 'unknown',
                    statusText: error?.response?.statusText || error?.statusText || 'unknown',
                    data: error?.response?.data || error?.data || null,
                    operation,
                    timestamp: new Date().toISOString(),
                    success: false,
                };

                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: errorDetails,
                            operation,
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                
                throw new Error(`CometApi ${operation} failed: ${errorDetails.message} (Status: ${errorDetails.status})`);
            }
        }

        return [returnData];
    }
}
