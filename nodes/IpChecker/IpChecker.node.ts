import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IHttpRequestMethods,
} from 'n8n-workflow';

export class IpChecker implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'IP Checker',
        name: 'ipChecker',
        icon: 'fa:globe',
        group: ['transform'],
        version: 1,
        description: 'Check your current IP address',
        defaults: {
            name: 'IP Checker',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [],
        properties: [],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const returnData: INodeExecutionData[] = [];
        
        try {
            // 检查当前 IP
            const ipResponse = await this.helpers.httpRequest({
                method: 'GET' as IHttpRequestMethods,
                url: 'https://api.ipify.org?format=json',
                json: true,
                timeout: 10000,
            });

            // 测试 CometApi 连接性
            let cometApiStatus = 'blocked';
            let cometApiError = '';
            
            try {
                await this.helpers.httpRequest({
                    method: 'GET' as IHttpRequestMethods,
                    url: 'https://api.cometapi.com',
                    timeout: 5000,
                });
                cometApiStatus = 'accessible';
            } catch (error) {
                cometApiError = (error as Error).message;
            }

            returnData.push({
                json: {
                    currentIP: ipResponse.ip,
                    timestamp: new Date().toISOString(),
                    cometApiStatus: cometApiStatus,
                    cometApiError: cometApiError,
                    previousBlockedIP: '120.228.15.115',
                    ipChanged: ipResponse.ip !== '120.228.15.115',
                    recommendations: ipResponse.ip === '120.228.15.115' ? [
                        'IP 未变更，仍然被封禁',
                        '请使用 VPN 更换 IP',
                        '或尝试其他网络连接',
                    ] : [
                        'IP 已更换！可以尝试连接 CometApi',
                        '使用 CometApi 测试节点进行测试',
                    ],
                },
            });

        } catch (error) {
            returnData.push({
                json: {
                    success: false,
                    message: 'Failed to check IP',
                    error: (error as Error).message,
                    timestamp: new Date().toISOString(),
                },
            });
        }

        return [returnData];
    }
}
