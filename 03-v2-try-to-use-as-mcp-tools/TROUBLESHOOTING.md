# MCP Connection Error - Troubleshooting Report

## Error Encountered

When attempting to use the `add` tool from the homework-search MCP server:

```
Error: connection closed: calling "tools/call": client is closing: EOF
```

## Investigation Results

### ✅ What Works

1. **Docker image exists**: `mcp-homework` image is built and available
2. **Wrapper script exists**: `run_mcp_server.bat` is present and executable
3. **Server starts**: The MCP server initializes when the wrapper is called
4. **FastMCP loads**: The server shows the welcome screen

### ❌ What Fails

**JSON-RPC Communication**: When Antigravity tries to communicate with the server via stdin/stdout, it encounters:
- "Internal Server Error" in JSON-RPC response
- Connection closes prematurely (EOF)
- The handshake or tool call fails

## Root Cause Analysis

The issue appears to be related to **how the Docker container handles stdin/stdout** for MCP protocol communication.

### Possible Causes

1. **Docker stdin buffering**: The `-i` flag might not be sufficient for interactive JSON-RPC communication
2. **Search index initialization**: The `setup_search()` call in `main.py` downloads and processes a zip file on startup, which:
   - Takes 10-15 seconds
   - Prints output to stdout
   - May interfere with MCP protocol messages
3. **Output contamination**: Print statements during initialization may corrupt the JSON-RPC stream
4. **Container lifecycle**: The container might be exiting before completing the handshake

## The Critical Issue: stdout Contamination

Looking at `main.py`:

```python
# This runs BEFORE mcp.run()
index = setup_search()  # Line 11
```

And `search.py`:

```python
def setup_search():
    print(f"Downloading {url}...")  # Line 10
    print("Processing zip file...")  # Line 15
    print(f"Indexed {len(documents)} documents.")  # Line 49
```

**Problem**: These print statements go to stdout BEFORE the MCP server starts listening. When Antigravity tries to parse JSON-RPC messages, it receives:

```
Downloading https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip...
Processing zip file...
Indexed 239 documents.
```

This **corrupts the JSON-RPC stream**, causing the "Internal Server Error" and connection closure.

## Solution

We need to either:
1. **Suppress stdout during initialization** (redirect to stderr)
2. **Lazy-load the search index** (only initialize when the search tool is called)
3. **Pre-build the index** in the Docker image (so no initialization needed at runtime)

### Recommended Fix: Redirect Initialization Output to stderr

Modify `search.py` to use `sys.stderr` instead of `print()`:

```python
import sys

def setup_search():
    url = "https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip"
    print(f"Downloading {url}...", file=sys.stderr)  # stderr instead of stdout
    # ... rest of code
```

This keeps stdout clean for JSON-RPC while still showing progress.

## Alternative Solutions

### Option 1: Lazy Loading (Simpler)

Don't initialize the index at module level. Instead, initialize it on first use:

```python
# main.py
from fastmcp import FastMCP
import requests
from search import setup_search

mcp = FastMCP("Demo 🚀")

# Don't initialize here
_index = None

def get_index():
    global _index
    if _index is None:
        _index = setup_search()
    return _index

@mcp.tool
def search(query: str) -> str:
    """Search the knowledge base for a query."""
    index = get_index()  # Initialize on first call
    return _search_with_index(index, query)
```

### Option 2: Pre-build Index in Docker (Fastest)

Modify `Dockerfile` to download and cache the zip file, then update `search.py` to use the cached file.

## Next Steps

1. Choose a solution approach
2. Implement the fix
3. Rebuild the Docker image
4. Test the MCP connection again
