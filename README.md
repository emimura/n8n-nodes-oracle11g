# n8n-nodes-oracle11g

Oracle 11g database node for n8n workflow automation platform.

## Features

- Execute SQL queries on Oracle 11g databases
- Support for both Service Name and SID connection types
- Built with Oracle Instant Client for compatibility
- Secure credential management

## Prerequisites

**IMPORTANT**: This package requires Oracle Instant Client to be installed on your n8n server for Oracle 11g compatibility.

### Docker Installation (Recommended)

Add Oracle Instant Client to your n8n Dockerfile:

```dockerfile
FROM n8nio/n8n:latest

# Switch to root to install Oracle Client
USER root

# Install dependencies
RUN apk add --no-cache wget unzip libaio libc6-compat gcompat libnsl

# Download and install Oracle Instant Client 21.9
RUN wget https://download.oracle.com/otn_software/linux/instantclient/219000/instantclient-basic-linux.x64-21.9.0.0.0dbru.zip -O /tmp/instantclient.zip && \
    mkdir -p /oracle && \
    unzip /tmp/instantclient.zip -d /oracle && \
    rm /tmp/instantclient.zip

# Set Oracle environment variables
ENV ORACLE_HOME=/oracle/instantclient_21_9
ENV LD_LIBRARY_PATH=$ORACLE_HOME:$LD_LIBRARY_PATH
ENV PATH=$ORACLE_HOME:$PATH

# Switch back to node user
USER node
```

### Docker Compose Example

```yaml
version: '3.8'
services:
  n8n:
    build: .
    ports:
      - "5678:5678"
    environment:
      - N8N_COMMUNITY_PACKAGES_ENABLED=true
      - ORACLE_HOME=/oracle/instantclient_21_9
      - LD_LIBRARY_PATH=/oracle/instantclient_21_9
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

### Manual Installation

If not using Docker, install Oracle Instant Client on your system:

1. Download Oracle Instant Client from Oracle website
2. Extract to `/oracle/instantclient_21_9` (or your preferred location)
3. Set environment variables:
   ```bash
   export ORACLE_HOME=/oracle/instantclient_21_9
   export LD_LIBRARY_PATH=$ORACLE_HOME:$LD_LIBRARY_PATH
   export PATH=$ORACLE_HOME:$PATH
   ```

## Installation

### Via n8n Community Packages

1. Go to **Settings** → **Community Packages** in your n8n instance
2. Install: `n8n-nodes-oracle11g`

### Via npm

```bash
npm install n8n-nodes-oracle11g
```

## Configuration

### Credentials

Create a new **Oracle 11g API** credential with:

- **Host**: Your Oracle server hostname/IP
- **Port**: Oracle port (default: 1521)
- **Database**: Service name or SID
- **Username**: Database username
- **Password**: Database password
- **Connection Type**: Choose "Service Name" or "SID"

### Node Usage

1. Add the **Oracle 11g** node to your workflow
2. Select your Oracle 11g API credential
3. Enter your SQL query
4. Execute the workflow

## Example

```sql
SELECT SYSDATE FROM dual
```

## Troubleshooting

### Error: "connections to this database server version are not supported by node-oracledb in Thin mode"

This error occurs when Oracle Instant Client is not properly installed. Ensure:

1. Oracle Instant Client is installed in your n8n environment
2. Environment variables are set correctly
3. n8n container/process has access to the Oracle libraries

### Error: "DPI-1047: Cannot locate a 64-bit Oracle Client library"

This indicates Oracle Instant Client is not found. Check:

1. Installation path is correct
2. `LD_LIBRARY_PATH` includes Oracle client directory
3. Oracle client architecture matches your system (x64)

## Requirements

- n8n version 0.126.0 or higher
- Oracle Instant Client 21.9 or compatible version
- Oracle 11g database server
- Network connectivity to Oracle server

## License

MIT

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/emimura/n8n-nodes-oracle11g).
