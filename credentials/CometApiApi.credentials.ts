import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class CometApiApi implements ICredentialType {
    name = 'cometApi';
    displayName = 'CometApi';
    properties: INodeProperties[] = [
        {
            displayName: 'Token',
            name: 'Token',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,

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
		},
	};
}
