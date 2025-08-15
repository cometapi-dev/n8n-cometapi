import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class CometApiApi implements ICredentialType {
    name = 'cometApiApi';
    displayName = 'CometAPI';
		documentationUrl = 'https://api.deerapi.com/doc';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: ''

        }
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
			url: '/api/user/self',
			method: 'GET',
		},
	};
}
