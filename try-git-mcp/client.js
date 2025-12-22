import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { EventSource } from "eventsource";

global.EventSource = EventSource;

async function main() {
    const url = "https://gitmcp.io/feature-engine/feature_engine/sse";
    console.log(`Connecting to ${url}...`);

    const transport = new SSEClientTransport(new URL(url));
    const client = new Client(
        {
            name: "git-mcp-explorer",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);
        console.log("Connected!");

        const tools = await client.listTools();
        console.log("Tools available:");
        console.log(JSON.stringify(tools, null, 2));

        await client.close();
    } catch (error) {
        console.error("Error connecting to MCP server:", error);
        process.exit(1);
    }
}

main();
