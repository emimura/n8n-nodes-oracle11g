class Oracle11gApi {
    constructor() {
        this.name = 'oracle11gApi';
        this.displayName = 'Oracle 11g API';
        this.properties = [
            {
                displayName: 'Host',
                name: 'host',
                type: 'string',
                default: '',
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
                displayName: 'Database',
                name: 'database',
                type: 'string',
                default: '',
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
                        value: 'service',
                    },
                    {
                        name: 'SID',
                        value: 'sid',
                    },
                ],
                default: 'service',
                required: true,
            },
        ];
    }
}

module.exports = { Oracle11gApi };
