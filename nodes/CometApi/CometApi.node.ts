import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    INodeExecutionData
} from 'n8n-workflow';

export class CometApi implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'CometAPI',
        name: 'cometApi',
        icon: 'file:cometApi.svg',
        group: ['transform'],
        version: 1,
        description: 'Call CometAPI AI endpoints',
        defaults: { name: 'CometAPI' },
        inputs: ["main"],
        outputs: ["main"],
        credentials: [
            { name: 'cometApiApi', required: true },
        ],
        properties: [
            {
                displayName: 'Prompt',
                name: 'prompt',
                type: 'string',
                default: '',
                required: true,
                description: 'Your AI prompt'},
        ]};

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];


        const credentials = await this.getCredentials('cometApiApi') as { apiKey: string };
        const apiKey = credentials.apiKey;

        for (let i = 0; i < items.length; i++) {
            const prompt = this.getNodeParameter('prompt', i) as string;

            try {
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: 'https://cometapi.com/',
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'},
                    body: { prompt },
                    json: true});

                returnData.push({
                    json: response,
                    pairedItem: { item: i },
                });
            } catch (error) {

                if (this.continueOnFail()) {
                    returnData.push({
                        json: { error: error.message },
                        pairedItem: { item: i }});
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}


