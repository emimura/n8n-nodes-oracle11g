"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oracle11g = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const oracledb = __importStar(require("oracledb"));
class Oracle11g {
    constructor() {
        this.description = {
            displayName: 'Oracle 11g Database',
            name: 'oracle11g',
            icon: 'file:oracle.png',
            group: ['input', 'output'],
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
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Execute Query',
                            value: 'executeQuery',
                            description: 'Execute a SQL query and return results',
                            action: 'Execute a SQL query',
                        },
                        {
                            name: 'Insert',
                            value: 'insert',
                            description: 'Insert data into table',
                            action: 'Insert data into table',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update data in table',
                            action: 'Update data in table',
                        },
                    ],
                    default: 'executeQuery',
                },
                {
                    displayName: 'Query',
                    name: 'query',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['executeQuery'],
                        },
                    },
                    typeOptions: {
                        editor: 'sqlEditor',
                        rows: 5,
                    },
                    default: 'SELECT SYSDATE FROM DUAL',
                    placeholder: 'SELECT * FROM your_table WHERE condition = :value',
                    description: 'SQL query to execute. Use :paramName for parameters.',
                },
                {
                    displayName: 'Table',
                    name: 'table',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['insert', 'update'],
                        },
                    },
                    default: '',
                    placeholder: 'TABLE_NAME',
                    description: 'Name of the table',
                },
                {
                    displayName: 'Columns',
                    name: 'columns',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['insert'],
                        },
                    },
                    default: '',
                    placeholder: 'column1, column2, column3',
                    description: 'Comma-separated list of column names',
                },
                {
                    displayName: 'Values',
                    name: 'values',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['insert'],
                        },
                    },
                    default: '',
                    placeholder: ':value1, :value2, :value3',
                    description: 'Comma-separated list of values (use :paramName for parameters)',
                },
                {
                    displayName: 'Set Clause',
                    name: 'setClause',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['update'],
                        },
                    },
                    default: '',
                    placeholder: 'column1 = :value1, column2 = :value2',
                    description: 'SET clause for UPDATE (use :paramName for parameters)',
                },
                {
                    displayName: 'Where Clause',
                    name: 'whereClause',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['update'],
                        },
                    },
                    default: '',
                    placeholder: 'id = :id',
                    description: 'WHERE clause for UPDATE (use :paramName for parameters)',
                },
                {
                    displayName: 'Parameters',
                    name: 'parameters',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    default: {},
                    placeholder: 'Add Parameter',
                    description: 'Parameters for the SQL query',
                    options: [
                        {
                            name: 'parameter',
                            displayName: 'Parameter',
                            values: [
                                {
                                    displayName: 'Name',
                                    name: 'name',
                                    type: 'string',
                                    default: '',
                                    placeholder: 'paramName',
                                    description: 'Parameter name (without :)',
                                },
                                {
                                    displayName: 'Value',
                                    name: 'value',
                                    type: 'string',
                                    default: '',
                                    description: 'Parameter value',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        // Initialize Oracle client in thick mode
        try {
            oracledb.initOracleClient({ libDir: '/oracle/instantclient_21_9' });
        }
        catch (err) {
            // Already initialized
        }
        for (let i = 0; i < items.length; i++) {
            try {
                const credentials = await this.getCredentials('oracle11gApi');
                const operation = this.getNodeParameter('operation', i);
                // Build connection string
                const connectionType = credentials.connectionType;
                let connectString;
                if (connectionType === 'sid') {
                    connectString = `${credentials.host}:${credentials.port}:${credentials.database}`;
                }
                else {
                    connectString = `${credentials.host}:${credentials.port}/${credentials.database}`;
                }
                const connectionConfig = {
                    user: credentials.username,
                    password: credentials.password,
                    connectString,
                };
                let connection;
                try {
                    connection = await oracledb.getConnection(connectionConfig);
                    let query = '';
                    let bindParams = {};
                    // Build parameters
                    const parameters = this.getNodeParameter('parameters', i);
                    if (parameters.parameter) {
                        for (const param of parameters.parameter) {
                            bindParams[param.name] = param.value;
                        }
                    }
                    // Build query based on operation
                    if (operation === 'executeQuery') {
                        query = this.getNodeParameter('query', i);
                    }
                    else if (operation === 'insert') {
                        const table = this.getNodeParameter('table', i);
                        const columns = this.getNodeParameter('columns', i);
                        const values = this.getNodeParameter('values', i);
                        query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
                    }
                    else if (operation === 'update') {
                        const table = this.getNodeParameter('table', i);
                        const setClause = this.getNodeParameter('setClause', i);
                        const whereClause = this.getNodeParameter('whereClause', i);
                        query = `UPDATE ${table} SET ${setClause}`;
                        if (whereClause) {
                            query += ` WHERE ${whereClause}`;
                        }
                    }
                    const result = await connection.execute(query, bindParams, {
                        outFormat: oracledb.OUT_FORMAT_OBJECT,
                        fetchArraySize: 100,
                        autoCommit: true,
                    });
                    if (operation === 'executeQuery' && result.rows && Array.isArray(result.rows)) {
                        for (const row of result.rows) {
                            returnData.push({
                                json: row,
                                pairedItem: { item: i },
                            });
                        }
                    }
                    else {
                        // For INSERT/UPDATE operations
                        returnData.push({
                            json: {
                                operation,
                                rowsAffected: result.rowsAffected || 0,
                                success: true,
                            },
                            pairedItem: { item: i },
                        });
                    }
                    await connection.close();
                }
                catch (error) {
                    if (connection) {
                        await connection.close();
                    }
                    throw error;
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                        },
                        pairedItem: {
                            item: i,
                        },
                    });
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                    itemIndex: i,
                });
            }
        }
        return [returnData];
    }
}
exports.Oracle11g = Oracle11g;
