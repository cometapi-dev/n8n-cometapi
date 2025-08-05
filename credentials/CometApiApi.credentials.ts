import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class CometApiApi implements ICredentialType {
    name = 'cometApiApi';
    displayName = 'CometAPI API';
    documentationUrl = 'https://cometapi.example.com/docs';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            default: '',
            required: true,
            typeOptions: { 
                password: true 
            },
            placeholder: 'your-api-key-here',
            description: 'Your CometAPI API Key.',
        },
    ];
}
