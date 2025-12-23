# MCP Server Setup Guide for Google Antigravity IDE

This guide shows you how to use your MCP server (`main.py`) with **Google Antigravity IDE** as a proper MCP client.

## What is MCP (Model Context Protocol)?

MCP is a **client-server protocol** that allows AI assistants to use external tools:
- **Server**: Your `main.py` exposes tools (`add`, `scrape_web_page`, `search`) via STDIO transport
- **Client**: Antigravity IDE connects to the server and calls tools using JSON-RPC messages
- **Protocol**: Communication happens via stdin/stdout, not direct function calls

## Current Setup Status

### ✅ What You Have (MCP Server)
Your `main.py` is already a proper MCP server:
```python
from fastmcp import FastMCP

mcp = FastMCP("Demo 🚀")

@mcp.tool
def search(query: str) -> str:
    """Search the knowledge base for a query."""
    return _search(query)

if __name__ == "__main__":
    mcp.run()  # Starts STDIO transport
```

### ❌ What You Don't Have Yet (MCP Client Configuration)
The Streamlit UI bypasses MCP by importing functions directly. To use **real MCP**, you need to configure Antigravity IDE.

---

## Step-by-Step: Configure MCP in Antigravity IDE

### Method 1: Using Antigravity's Built-in UI (Recommended)

This is the easiest way to configure your MCP server in Antigravity IDE:

1. **Open Antigravity IDE** and start an Agent chat session OR reuse a current Agent chat session


2. **Access MCP Settings:**
   - Click the **"..."** menu in the agent side panel
     <img width="1911" height="1036" alt="image-antigravity-mcp-server-button" src="https://github.com/user-attachments/assets/c9bca5f0-c379-4dd0-aa1a-9353ab63ba96" />
   - Select **"MCP Servers"**
   - Choose **"Manage MCP Servers"**
     <img width="1914" height="1031" alt="image-manage-mcp-servers" src="https://github.com/user-attachments/assets/43f7c727-1e0a-4a92-9667-2579cdff19dd" />



3. **Add Your Server:**
   - Click **"View raw config"** to open `mcp_config.json`
     <img width="1417" height="680" alt="image-view-raw-config" src="https://github.com/user-attachments/assets/6f4165e8-27b9-46bb-b464-e9abd0724c30" />
   - Add your server configuration:

```json
{
  "mcpServers": {
    "homework-search": {
      "command": "uv",
      "args": [
        "--directory",
        "c:/Users/kaiqu/Downloads/aidevtools-homework/03-mcp",
        "run",
        "python",
        "main.py"
      ]
    }
  }
}
```

4. **Save and Restart:**
   - Save the configuration file
   - Restart the agent session (or reload Antigravity IDE)

### Method 2: Manual File Configuration (Alternative)

If you prefer to edit the file directly:

**File Location:**
```
<workspace>/.agent/mcp_config.json
```
Or create `.mcp.json` in your project root.

Use the same JSON configuration as above.


### Step 4: Verify MCP Connection

In Antigravity IDE, you should see:
- A notification that MCP servers are connected
- Your tools (`add`, `scrape_web_page`, `search`) available in the tool list

### Step 5: Test the MCP Server

Try asking Antigravity:
```
Use the search tool to find information about "testing" in the knowledge base
```

Antigravity will:
1. Start your MCP server as a subprocess
2. Send a JSON-RPC message via stdin
3. Receive the response via stdout
4. Display the results

---

## Troubleshooting

### Server Not Starting
**Check:**
- Is `uv` installed and in PATH?
- Is the path in the config correct?
- Try running manually: `uv --directory c:/Users/kaiqu/Downloads/aidevtools-homework/03-mcp run python main.py`

### Tools Not Showing Up
**Check:**
- Restart Antigravity IDE completely
- Check the MCP logs (usually in IDE output panel)
- Verify `main.py` has `@mcp.tool` decorators

### "Index Not Found" Error
**Issue:** The search tool downloads and indexes on first run
**Solution:** This is normal - the first search will take ~10 seconds to download and index the FastMCP docs

---

## Comparison: Streamlit UI vs Real MCP

### Streamlit UI (What You Built)
```python
# Direct function call - NOT using MCP protocol
from main import _search
result = _search("demo", num_results=5)
```
- ✅ Simple and fast
- ✅ Works in Docker
- ❌ Not using MCP protocol
- ❌ Can't be used by other MCP clients

### Antigravity IDE (Real MCP Client)
```
User: "Search for 'demo' in the knowledge base"
Antigravity → Starts main.py subprocess
Antigravity → Sends JSON-RPC: {"method": "tools/call", "params": {"name": "search", "arguments": {"query": "demo"}}}
main.py → Processes request
main.py → Returns JSON-RPC response
Antigravity → Shows results to user
```
- ✅ True MCP protocol
- ✅ Works with any MCP client
- ✅ Proper client-server architecture
- ❌ Requires local Python/uv installation

---

## Next Steps

1. **Configure Antigravity** using the JSON above
2. **Test the connection** by asking Antigravity to use your tools
3. **Compare** the experience with the Streamlit UI

The Streamlit UI is great for quick demos, but the MCP integration in Antigravity is the "real deal" - it's how MCP is meant to be used!

---

## Additional MCP Clients

Your server can also work with:
- **Claude Desktop** (Anthropic's official client)
- **Cline** (VS Code extension)
- **Any tool** that implements the MCP protocol

Each requires similar configuration pointing to your `main.py` server.
