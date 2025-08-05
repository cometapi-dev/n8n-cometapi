import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class CometApiApi implements ICredentialType {
    name = 'cometApiApi';
    displayName = 'CometApi API';
    documentationUrl = 'https://api.cometapi.com/docs';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            description: 'Your CometApi API key',
            placeholder: 'Enter your API key...',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: 'Bearer {{$credentials.apiKey}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://api.cometapi.com',
            url: '/models',
            method: 'GET',
        },
    };
}
