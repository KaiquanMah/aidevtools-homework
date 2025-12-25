Clone repo
```bash
@kaiquanmah0 ➜ /workspaces/aidevtools-homework (main) $ git clone https://github.com/thelearningdev/mcp-ai-dev-workflow.git
Cloning into 'mcp-ai-dev-workflow'...
remote: Enumerating objects: 152, done.
remote: Counting objects: 100% (152/152), done.
remote: Compressing objects: 100% (93/93), done.
remote: Total 152 (delta 52), reused 151 (delta 51), pack-reused 0 (from 0)
Receiving objects: 100% (152/152), 3.54 MiB | 29.49 MiB/s, done.
Resolving deltas: 100% (52/52), done.
```

Part 1 Step 1 - Setup python environment
```bash
@kaiquanmah0 ➜ /workspaces/aidevtools-homework (main) $ mv ./mcp-ai-dev-workflow/ ./03-v0-lesson-context7
@kaiquanmah0 ➜ /workspaces/aidevtools-homework (main) $ cd ./03-v0-lesson-context7/
@kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7 (main) $ cd code
uv sync
uv venv
source .venv/bin/activate
bash: uv: command not found
bash: uv: command not found
bash: .venv/bin/activate: No such file or directory
```

To fix the above error - Install uv
```bash
@kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ curl -LsSf https://astral.sh/uv/install.sh | sh
downloading uv 0.9.18 x86_64-unknown-linux-gnu
no checksums to verify
installing to /home/codespace/.local/bin
  uv
  uvx
everything's installed!

@kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ source $HOME/.cargo/env
bash: /home/codespace/.cargo/env: No such file or directory
```


Retry python environment setup
```bash
@kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ uv sync
Using CPython 3.12.1 interpreter at: /home/codespace/.python/current/bin/python3
Creating virtual environment at: .venv
Resolved 82 packages in 1ms
      Built sampling @ file:///workspaces/aidevtools-homework/03-v0-lesson-context7/code
Prepared 80 packages in 2.47s
░░░░░░░░░░░░░░░░░░░░ [0/80] Installing wheels...                                                                                                                warning: Failed to hardlink files; falling back to full copy. This may lead to degraded performance.
         If the cache and target directories are on different filesystems, hardlinking may not be supported.
         If this is intentional, set `export UV_LINK_MODE=copy` or use `--link-mode=copy` to suppress this warning.
Installed 80 packages in 366ms
 + aioconsole==0.8.1
 + annotated-types==0.7.0
 + anthropic==0.68.0
 + anyio==4.10.0
 + attrs==25.3.0
 + authlib==1.6.4
 + certifi==2025.8.3
 + cffi==2.0.0
 + charset-normalizer==3.4.3
 + click==8.2.1
 + cryptography==46.0.1
 + cyclopts==3.24.0
 + distro==1.9.0
 + dnspython==2.8.0
 + docstring-parser==0.17.0
 + docutils==0.22.1
 + email-validator==2.3.0
 + exceptiongroup==1.3.0
 + fastapi==0.117.1
 + fastapi-cli==0.0.13
 + fastapi-cloud-cli==0.2.0
 + fastmcp==2.12.3
 + h11==0.16.0
 + httpcore==1.0.9
 + httptools==0.6.4
 + httpx==0.28.1
 + httpx-sse==0.4.1
 + idna==3.10
 + isodate==0.7.2
 + jinja2==3.1.6
 + jiter==0.11.0
 + jsonschema==4.25.1
 + jsonschema-path==0.3.4
 + jsonschema-specifications==2025.9.1
 + lazy-object-proxy==1.12.0
 + markdown-it-py==4.0.0
 + markupsafe==3.0.2
 + mcp==1.14.0
 + mdurl==0.1.2
 + more-itertools==10.8.0
 + openapi-core==0.19.5
 + openapi-pydantic==0.5.1
 + openapi-schema-validator==0.6.3
 + openapi-spec-validator==0.7.2
 + parse==1.20.2
 + pathable==0.4.4
 + pycparser==2.23
 + pydantic==2.11.9
 + pydantic-core==2.33.2
 + pydantic-settings==2.10.1
 + pygments==2.19.2
 + pyperclip==1.10.0
 + python-dotenv==1.1.1
 + python-multipart==0.0.20
 + pyyaml==6.0.2
 + referencing==0.36.2
 + requests==2.32.5
 + rfc3339-validator==0.1.4
 + rich==14.1.0
 + rich-rst==1.3.1
 + rich-toolkit==0.15.1
 + rignore==0.6.4
 + rpds-py==0.27.1
 + ruff==0.13.0
 + sampling==0.1.0 (from file:///workspaces/aidevtools-homework/03-v0-lesson-context7/code)
 + sentry-sdk==2.38.0
 + shellingham==1.5.4
 + six==1.17.0
 + sniffio==1.3.1
 + sse-starlette==3.0.2
 + starlette==0.48.0
 + typer==0.17.4
 + typing-extensions==4.15.0
 + typing-inspection==0.4.1
 + urllib3==2.5.0
 + uvicorn==0.35.0
 + uvloop==0.21.0
 + watchfiles==1.1.0
 + websockets==15.0.1
 + werkzeug==3.1.1


@kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ uv venv
Using CPython 3.12.1 interpreter at: /home/codespace/.python/current/bin/python3
Creating virtual environment at: .venv
✔ A virtual environment already exists at `.venv`. Do you want to replace it? · yes
Activate with: source .venv/bin/activate
```



Virtualenv cant detect mcp library
```bash
@kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ source .venv/bin/activate
(code) @kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ cd 0-mcp-demo/stdio/
(code) @kaiquanmah0 ➜ .../03-v0-lesson-context7/code/0-mcp-demo/stdio (main) $ python stdio_server.py
Traceback (most recent call last):
  File "/workspaces/aidevtools-homework/03-v0-lesson-context7/code/0-mcp-demo/stdio/stdio_server.py", line 4, in <module>
    from mcp.server.fastmcp import FastMCP, Context
ModuleNotFoundError: No module named 'mcp'
```


Troubleshoot library setup
```bash
(code) @kaiquanmah0 ➜ .../03-v0-lesson-context7/code/0-mcp-demo/stdio (main) $ cd ..
(code) @kaiquanmah0 ➜ .../aidevtools-homework/03-v0-lesson-context7/code/0-mcp-demo (main) $ cd ..
(code) @kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ cd ..
(code) @kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7 (main) $ cd code
(code) @kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ uv sync
Resolved 82 packages in 1ms
░░░░░░░░░░░░░░░░░░░░ [0/80] Installing wheels...                                                                                                                warning: Failed to hardlink files; falling back to full copy. This may lead to degraded performance.
         If the cache and target directories are on different filesystems, hardlinking may not be supported.
         If this is intentional, set `export UV_LINK_MODE=copy` or use `--link-mode=copy` to suppress this warning.
Installed 80 packages in 355ms
 + aioconsole==0.8.1
 + annotated-types==0.7.0
 + anthropic==0.68.0
 + anyio==4.10.0
 + attrs==25.3.0
 + authlib==1.6.4
 + certifi==2025.8.3
 + cffi==2.0.0
 + charset-normalizer==3.4.3
 + click==8.2.1
 + cryptography==46.0.1
 + cyclopts==3.24.0
 + distro==1.9.0
 + dnspython==2.8.0
 + docstring-parser==0.17.0
 + docutils==0.22.1
 + email-validator==2.3.0
 + exceptiongroup==1.3.0
 + fastapi==0.117.1
 + fastapi-cli==0.0.13
 + fastapi-cloud-cli==0.2.0
 + fastmcp==2.12.3
 + h11==0.16.0
 + httpcore==1.0.9
 + httptools==0.6.4
 + httpx==0.28.1
 + httpx-sse==0.4.1
 + idna==3.10
 + isodate==0.7.2
 + jinja2==3.1.6
 + jiter==0.11.0
 + jsonschema==4.25.1
 + jsonschema-path==0.3.4
 + jsonschema-specifications==2025.9.1
 + lazy-object-proxy==1.12.0
 + markdown-it-py==4.0.0
 + markupsafe==3.0.2
 + mcp==1.14.0
 + mdurl==0.1.2
 + more-itertools==10.8.0
 + openapi-core==0.19.5
 + openapi-pydantic==0.5.1
 + openapi-schema-validator==0.6.3
 + openapi-spec-validator==0.7.2
 + parse==1.20.2
 + pathable==0.4.4
 + pycparser==2.23
 + pydantic==2.11.9
 + pydantic-core==2.33.2
 + pydantic-settings==2.10.1
 + pygments==2.19.2
 + pyperclip==1.10.0
 + python-dotenv==1.1.1
 + python-multipart==0.0.20
 + pyyaml==6.0.2
 + referencing==0.36.2
 + requests==2.32.5
 + rfc3339-validator==0.1.4
 + rich==14.1.0
 + rich-rst==1.3.1
 + rich-toolkit==0.15.1
 + rignore==0.6.4
 + rpds-py==0.27.1
 + ruff==0.13.0
 + sampling==0.1.0 (from file:///workspaces/aidevtools-homework/03-v0-lesson-context7/code)
 + sentry-sdk==2.38.0
 + shellingham==1.5.4
 + six==1.17.0
 + sniffio==1.3.1
 + sse-starlette==3.0.2
 + starlette==0.48.0
 + typer==0.17.4
 + typing-extensions==4.15.0
 + typing-inspection==0.4.1
 + urllib3==2.5.0
 + uvicorn==0.35.0
 + uvloop==0.21.0
 + watchfiles==1.1.0
 + websockets==15.0.1
 + werkzeug==3.1.1
 ```


part 1 step 2 - start server
* use uv run instead of just python - this ensures the virtual environment's Python interpreter and installed packages are used
```bash
(code) @kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ uv run python 0-mcp-demo/stdio/stdio_server.py
starting server

# cmd1 - initialize client
#        returns the MCP server name
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test-client","version":"1.0.0"}}}
{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05","capabilities":{"experimental":{},"prompts":{"listChanged":false},"resources":{"subscribe":false,"listChanged":false},"tools":{"listChanged":false}},"serverInfo":{"name":"0-mcp-intro-weather","version":"1.14.0"}}}


# 2 - initialize the notification
{"jsonrpc":"2.0","method":"notifications/initialized"}
# Note: You won't receive a JSON response here

# 3 - list the tools
{"jsonrpc":"2.0","id":2,"method":"tools/list"}
[12/25/25 02:47:15] INFO     Processing request of type ListToolsRequest                                                                           server.py:623
{"jsonrpc":"2.0","id":2,"result":{"tools":[{"name":"get_weather","description":"","inputSchema":{"properties":{"city":{"title":"City","type":"string"}},"required":["city"],"title":"get_weatherArguments","type":"object"}},{"name":"summarize","description":"","inputSchema":{"properties":{"text_to_summarize":{"title":"Text To Summarize","type":"string"}},"required":["text_to_summarize"],"title":"summarizeArguments","type":"object"}},{"name":"add","description":"","inputSchema":{"properties":{"a":{"title":"A","type":"integer"},"b":{"title":"B","type":"integer"}},"required":["a","b"],"title":"addArguments","type":"object"},"outputSchema":{"properties":{"result":{"title":"Result","type":"integer"}},"required":["result"],"title":"addOutput","type":"object"}},{"name":"list_folders_under_roots","description":"\n    Lists all folders under the client roots (as specified by the MCP client).\n    ","inputSchema":{"properties":{},"title":"list_folders_under_rootsArguments","type":"object"}}]}}


# call tool get_weather
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_weather","arguments":{"city":"London"}}}
[12/25/25 03:06:26] INFO     Processing request of type CallToolRequest                                                                            server.py:623
{"jsonrpc":"2.0","id":3,"result":{"content":[{"type":"text","text":"22"}],"isError":false}}

```

