## Workings - Old sh at step 4 (with pipe at the end)
```bash
kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools (main)
$ ./verify_mcp_setup.sh
==========================================
MCP Server Verification Script
==========================================

Step 1: Checking if Docker is available...
✅ Docker is installed
Docker version 28.5.2, build ecc6942

Step 2: Checking if Docker daemon is running...
✅ Docker daemon is running

Step 3: Checking if mcp-homework Docker image exists...
✅ mcp-homework image found
mcp-homework              latest    a4ae24d01b3a   44 minutes ago   2.45GB

Step 4: Testing the MCP server startup...
   Starting server for 3 seconds to verify it works...
   (You should see the FastMCP welcome screen)


⚠️  Server exited unexpectedly. Check the output above for errors.

==========================================
Verification Summary
==========================================

If all checks passed, your MCP server is ready to use!

Next steps:
1. Verify MCP configuration in Antigravity IDE:
   - Click '...' → 'MCP Servers' → 'Manage MCP Servers'
   - Check that 'homework-search' is listed and connected

2. Test with a simple prompt in Antigravity:
   'Please use the add tool from the homework-search MCP server to add 5 and 3.'

3. Test the search tool:
   'Please use the search tool from the homework-search MCP server to find information about "demo".'













kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools (main)
$ docker run --rm -i mcp-homework uv run python main.py


╭──────────────────────────────────────────────────────────────────────────────╮
│                                                                              │
│                         ▄▀▀ ▄▀█ █▀▀ ▀█▀ █▀▄▀█ █▀▀ █▀█                        │
│                         █▀  █▀█ ▄▄█  █  █ ▀ █ █▄▄ █▀▀                        │
│                                                                              │
│                                FastMCP 2.14.1                                │
│                                                                              │
│                                                                              │
│                    🖥  Server name: Demo 🚀                                   │
│                                                                              │
│                    📦 Transport:   STDIO                                     │
│                                                                              │
│                    📚 Docs:        https://gofastmcp.com                     │
│                    🚀 Hosting:     https://fastmcp.cloud                     │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯


[12/24/25 02:46:49] INFO     Starting MCP server 'Demo 🚀' with   server.py:2527
                             transport 'stdio'











kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools (main)
$ docker run --rm -i mcp-homework uv run python main.py 2>&1 | head -n 30


╭──────────────────────────────────────────────────────────────────────────────╮
│                                                                              │
│                         ▄▀▀ ▄▀█ █▀▀ ▀█▀ █▀▄▀█ █▀▀ █▀█                        │
│                         █▀  █▀█ ▄▄█  █  █ ▀ █ █▄▄ █▀▀                        │
│                                                                              │
│                                FastMCP 2.14.1                                │
│                                                                              │
│                                                                              │
│                    🖥  Server name: Demo 🚀                                   │
│                                                                              │
│                    📦 Transport:   STDIO                                     │
│                                                                              │
│                    📚 Docs:        https://gofastmcp.com                     │
│                    🚀 Hosting:     https://fastmcp.cloud                     │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯


[12/24/25 02:47:19] INFO     Starting MCP server 'Demo 🚀' with   server.py:2527
                             transport 'stdio'

```



## Workings - Fixed sh at step 4 (NO pipe at the end)
```bash
kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools (main)
$ ./verify_mcp_setup.sh
==========================================
MCP Server Verification Script
==========================================

Step 1: Checking if Docker is available...
✅ Docker is installed
Docker version 28.5.2, build ecc6942

Step 2: Checking if Docker daemon is running...
✅ Docker daemon is running

Step 3: Checking if mcp-homework Docker image exists...
✅ mcp-homework image found
mcp-homework              latest    a4ae24d01b3a   About an hour ago   2.45GB

Step 4: Testing the MCP server startup...
   Starting server for 15 seconds to verify it works...
   (You should see the FastMCP welcome screen)



╭──────────────────────────────────────────────────────────────────────────────╮
│                                                                              │
│                         ▄▀▀ ▄▀█ █▀▀ ▀█▀ █▀▄▀█ █▀▀ █▀█                        │
│                         █▀  █▀█ ▄▄█  █  █ ▀ █ █▄▄ █▀▀                        │
│                                                                              │
│                                FastMCP 2.14.1                                │
│                                                                              │
│                                                                              │
│                    🖥  Server name: Demo 🚀                                   │
│                                                                              │
│                    📦 Transport:   STDIO                                     │
│                                                                              │
│                    📚 Docs:        https://gofastmcp.com                     │
│                    🚀 Hosting:     https://fastmcp.cloud                     │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯


[12/24/25 03:11:52] INFO     Starting MCP server 'Demo 🚀' with   server.py:2527
                             transport 'stdio'

✅ Server started successfully (timed out as expected)

==========================================
Verification Summary
==========================================

If all checks passed, your MCP server is ready to use!

Next steps:
1. Verify MCP configuration in Antigravity IDE:
   - Click '...' → 'MCP Servers' → 'Manage MCP Servers'
   - Check that 'homework-search' is listed and connected

2. Test with a simple prompt in Antigravity:
   'Please use the add tool from the homework-search MCP server to add 5 and 3.'

3. Test the search tool:
   'Please use the search tool from the homework-search MCP server to find information about "demo".'












kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools (main)
$ docker run --rm -i mcp-homework uv run python main.py 2>&1


╭──────────────────────────────────────────────────────────────────────────────╮
│                                                                              │
│                         ▄▀▀ ▄▀█ █▀▀ ▀█▀ █▀▄▀█ █▀▀ █▀█                        │
│                         █▀  █▀█ ▄▄█  █  █ ▀ █ █▄▄ █▀▀                        │
│                                                                              │
│                                FastMCP 2.14.1                                │
│                                                                              │
│                                                                              │
│                    🖥  Server name: Demo 🚀                                   │
│                                                                              │
│                    📦 Transport:   STDIO                                     │
│                                                                              │
│                    📚 Docs:        https://gofastmcp.com                     │
│                    🚀 Hosting:     https://fastmcp.cloud                     │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯


[12/24/25 02:57:58] INFO     Starting MCP server 'Demo 🚀' with   server.py:2527
                             transport 'stdio'











#################################################
# Error if you enter a value at step 4
# when running docker container
#################################################
abq
Received exception from stream: 1 validation error for JSONRPCMessage
  Invalid JSON: expected value at line 1 column 1 [type=json_invalid, input_value='abq\n', input_type=str]
    For further information visit https://errors.pydantic.dev/2.12/v/json_invalid
{"method":"notifications/message","params":{"level":"error","logger":"mcp.server.exception_handler","data":"Internal Server Error"},"jsonrpc":"2.0"}

12
Received exception from stream: 4 validation errors for JSONRPCMessage
JSONRPCRequest
  Input should be an object [type=model_type, input_value=12, input_type=int]
    For further information visit https://errors.pydantic.dev/2.12/v/model_type
JSONRPCNotification
  Input should be an object [type=model_type, input_value=12, input_type=int]
    For further information visit https://errors.pydantic.dev/2.12/v/model_type
JSONRPCResponse
  Input should be an object [type=model_type, input_value=12, input_type=int]
    For further information visit https://errors.pydantic.dev/2.12/v/model_type
JSONRPCError
  Input should be an object [type=model_type, input_value=12, input_type=int]
    For further information visit https://errors.pydantic.dev/2.12/v/model_type
{"method":"notifications/message","params":{"level":"error","logger":"mcp.server.exception_handler","data":"Internal Server Error"},"jsonrpc":"2.0"}

2
Received exception from stream: 4 validation errors for JSONRPCMessage
JSONRPCRequest
  Input should be an object [type=model_type, input_value=2, input_type=int]
    For further information visit https://errors.pydantic.dev/2.12/v/model_type
JSONRPCNotification
  Input should be an object [type=model_type, input_value=2, input_type=int]
    For further information visit https://errors.pydantic.dev/2.12/v/model_type
JSONRPCResponse
  Input should be an object [type=model_type, input_value=2, input_type=int]
    For further information visit https://errors.pydantic.dev/2.12/v/model_type
JSONRPCError
  Input should be an object [type=model_type, input_value=2, input_type=int]
    For further information visit https://errors.pydantic.dev/2.12/v/model_type
{"method":"notifications/message","params":{"level":"error","logger":"mcp.server.exception_handler","data":"Internal Server Error"},"jsonrpc":"2.0"}
#################################################
```