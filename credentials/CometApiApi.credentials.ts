import { ICredentialType, INodeProperties ,ICredentialTestRequest} from 'n8n-workflow';

export class CometApiApi implements ICredentialType {
    name = 'cometApiApi';
    displayName = 'CometAPI API';
    documentationUrl = 'https://api.cometapi.com/docs';
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
			test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.cometapi.com.',
			url: '',
		},
	};
}
