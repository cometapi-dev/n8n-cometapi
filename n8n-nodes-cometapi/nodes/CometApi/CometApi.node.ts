import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeConnectionType,
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
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [
            {
                name: 'cometApiApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Prompt',
                name: 'prompt',
                type: 'string',
                typeOptions: {
                    rows: 4,
                },
                default: '',
                placeholder: 'Enter your prompt...',
                description: 'The prompt to send to CometApi',
            },
            {
                displayName: 'Model',
                name: 'model',
                type: 'options',
                options: [
                    { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
                    { name: 'GPT-4', value: 'gpt-4' },
                    { name: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
                    { name: 'Claude-3 Sonnet', value: 'claude-3-sonnet' },
                    { name: 'Claude-3 Haiku', value: 'claude-3-haiku' },
                    { name: 'Gemini Pro', value: 'gemini-pro' },
                ],
                default: 'gpt-3.5-turbo',
                description: 'AI model to use',
            },
            {
                displayName: 'Max Tokens',
                name: 'maxTokens',
                type: 'number',
                default: 1000,
                description: 'Maximum number of tokens to generate',
            },
            {
                displayName: 'Temperature',
                name: 'temperature',
                type: 'number',
                default: 0.7,
                typeOptions: {
                    minValue: 0,
                    maxValue: 2,
                    numberPrecision: 2,
                },
                description: 'Controls randomness (0=deterministic, 2=very random)',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const credentials = await this.getCredentials('cometApiApi');

        for (let i = 0; i < items.length; i++) {
            const prompt = this.getNodeParameter('prompt', i) as string;
            const model = this.getNodeParameter('model', i) as string;
            const maxTokens = this.getNodeParameter('maxTokens', i) as number;
            const temperature = this.getNodeParameter('temperature', i) as number;
            
            try {
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    baseURL: 'https://api.cometapi.com',
                    url: '/chat/completions',
                    headers: {
                        'Authorization': `Bearer ${credentials.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: {
                        model: model,
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: maxTokens,
                        temperature: temperature,
                    },
                    json: true,
                });

                returnData.push({
                    json: {
                        prompt,
                        model,
                        maxTokens,
                        temperature,
                        response,
                        timestamp: new Date().toISOString(),
                    },
                    pairedItem: { item: i },
                });

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: errorMessage,
                            prompt,
                            model,
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
