const { NodeOperationError } = require('n8n-workflow');

class Oracle11g {
    constructor() {
        this.description = {
            displayName: 'Oracle 11g',
            name: 'oracle11g',
            icon: 'fa:database',
            group: ['input'],
            version: 1,
            description: 'Execute SQL queries on Oracle 11g database',
            defaults: {
                name: 'Oracle 11g',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'oracle11gApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'SQL Query',
                    name: 'query',
                    type: 'string',
                    typeOptions: {
                        rows: 5,
                    },
                    default: 'SELECT SYSDATE FROM dual',
                    required: true,
                    description: 'SQL query to execute',
                },
            ],
        };
    }

    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const oracledb = require('oracledb');

        // Habilitar thick mode para Oracle 11g
        try {
            oracledb.initOracleClient();
        } catch (err) {
            // Já inicializado ou não disponível
        }

        for (let i = 0; i < items.length; i++) {
            try {
                const credentials = await this.getCredentials('oracle11gApi');
                const query = this.getNodeParameter('query', i);

                const connectionString = credentials.connectionType === 'service' 
                    ? credentials.host + ':' + credentials.port + '/' + credentials.database
                    : credentials.host + ':' + credentials.port + ':' + credentials.database;

                const connection = await oracledb.getConnection({
                    user: credentials.username,
                    password: credentials.password,
                    connectString: connectionString,
                });

                const result = await connection.execute(query);
                await connection.close();

                returnData.push({
                    json: {
                        query,
                        result: result.rows,
                        columns: result.metaData ? result.metaData.map(col => col.name) : [],
                    },
                });
            } catch (error) {
                throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
            }
        }

        return [returnData];
    }
}

module.exports = { Oracle11g };
