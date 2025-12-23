import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class Oracle11gApi implements ICredentialType {
	name = 'oracle11gApi';
	displayName = 'Oracle 11g Database';
	documentationUrl = 'https://docs.oracle.com/cd/B28359_01/server.111/b28318/toc.htm';
	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: 'localhost',
			required: true,
		},
		{
			displayName: 'Port',
			name: 'port',
			type: 'number',
			default: 1521,
			required: true,
		},
		{
			displayName: 'Service Name / SID',
			name: 'database',
			type: 'string',
			default: '',
			placeholder: 'ORCL or XE',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'Connection Type',
			name: 'connectionType',
			type: 'options',
			options: [
				{
					name: 'Service Name',
					value: 'serviceName',
				},
				{
					name: 'SID',
					value: 'sid',
				},
			],
			default: 'serviceName',
		},
	];
}
