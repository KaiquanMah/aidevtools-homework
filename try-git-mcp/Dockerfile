FROM node:22-slim

RUN apt-get update && apt-get install -y git build-essential python3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies for custom client
RUN npm install @modelcontextprotocol/sdk eventsource zod

COPY client.js .
COPY test_mcp.sh .
RUN chmod +x test_mcp.sh

CMD ["./test_mcp.sh"]
