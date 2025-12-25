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



Part 1 step 3 - visualise MCP tool calls in MCP inspector
```
@kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7 (main) $ npx @modelcontextprotocol/inspector
Need to install the following packages:
@modelcontextprotocol/inspector@0.18.0
Ok to proceed? (y) y
npm WARN deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
Starting MCP inspector...
⚙️ Proxy server listening on localhost:6277
🔑 Session token: fc788b0b7dd19fe4d0f8b6dec942d5a475151557317593ceebb5b62e36b0bce6
   Use this token to authenticate requests or set DANGEROUSLY_OMIT_AUTH=true to disable auth

🚀 MCP Inspector is up and running at:
   http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=fc788b0b7dd19fe4d0f8b6dec942d5a475151557317593ceebb5b62e36b0bce6

🌐 Opening browser...


```

* MCP Inspector - https://miniature-space-meme-5g564g65949pcvr9g-6274.app.github.dev/
  * 2. Note down two things
    * Your python environment
      * Type `which python` you will get an answer like this `<YOUR_BASE_PATH>/mcp-for-ai-dev-course/code/.venv/bin/python`
      ```bash
      @kaiquanmah0 ➜ /workspaces/aidevtools-homework (main) $ which python
      /home/codespace/.python/current/bin/python

      @kaiquanmah0 ➜ /workspaces/aidevtools-homework (main) $ cd ./03-v0-lesson-context7/
      @kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7 (main) $ cd code
      @kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ source .venv/bin/activate
      (code) @kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ which python
      /workspaces/aidevtools-homework/03-v0-lesson-context7/code/.venv/bin/python
      ```
    * Path to the stdio_server.py
      * On vscode, Right click on the stdio_server.py file and copy path <YOUR_BASE_PATH>/mcp-for-ai-dev-course/code/0-mcp-demo/stdio/stdio_server.py
      ```bash
      /workspaces/aidevtools-homework/03-v0-lesson-context7/code/0-mcp-demo/stdio/stdio_server.py
      ```
    * Replace YOUR_BASE_PATH with right path according to your laptop
  * 3. Add these to MCP inspector
    * Under command - add python path
    * Under Arguments - add stdio_server path
    * Option 1 - Enter into UI
      ```bash
      # SO OUR
      YOUR_BASE_PATH = '/workspaces/aidevtools-homework'
      ```
      * Error
        `Error Connecting to MCP Inspector Proxy - Check Console logs`
    * Option 2 - Run in Terminal
      * Template
        ```bash
        npx @modelcontextprotocol/inspector \
          <YOUR_BASE_PATH>/mcp-for-ai-dev-course/code/.venv/bin/python \
          <YOUR_BASE_PATH>/mcp-for-ai-dev-course/code/0-mcp-demo/stdio/stdio_server.py
        ```
      * Actual
        ```bash
        npx @modelcontextprotocol/inspector \
          /workspaces/aidevtools-homework/03-v0-lesson-context7/code/.venv/bin/python \
          /workspaces/aidevtools-homework/03-v0-lesson-context7/code/0-mcp-demo/stdio/stdio_server.py
        ```
      * Terminal
        ```bash
        Starting MCP inspector...
        ⚙️ Proxy server listening on localhost:6277
        🔑 Session token: ce80384b56b4a6df6cd3cbe0c2bab10ab4fd7e5ed4b5bf91ac4fbf49ef29a21e
          Use this token to authenticate requests or set DANGEROUSLY_OMIT_AUTH=true to disable auth

        🚀 MCP Inspector is up and running at:
          http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=ce80384b56b4a6df6cd3cbe0c2bab10ab4fd7e5ed4b5bf91ac4fbf49ef29a21e

        🌐 Opening browser...
        ```
      * Same error
        ```
        Error Connecting to MCP Inspector Proxy - Check Console logs

        index-Dw52pmVD.js:57798 
        GET https://miniature-space-meme-5g564g65949pcvr9g-6274.app.github.dev:6277/config net::ERR_CONNECTION_TIMED_OUT
        (anonymous)	@	index-Dw52pmVD.js:57798
        Qj	@	index-Dw52pmVD.js:5009
        Hk	@	index-Dw52pmVD.js:6244
        Ek	@	index-Dw52pmVD.js:5808
        jg	@	index-Dw52pmVD.js:2722
        Wk	@	index-Dw52pmVD.js:6148
        Pk	@	index-Dw52pmVD.js:6091
        Gk	@	index-Dw52pmVD.js:5747
        J2	@	index-Dw52pmVD.js:437
        R	@	index-Dw52pmVD.js:465
        index-Dw52pmVD.js:57815 Error fetching default environment: TypeError: Failed to fetch
            at index-Dw52pmVD.js:57798:5
            at Qj (index-Dw52pmVD.js:5009:23)
            at Hk (index-Dw52pmVD.js:6244:21)
            at Ek (index-Dw52pmVD.js:5808:5)
            at jg (index-Dw52pmVD.js:2722:17)
            at Wk (index-Dw52pmVD.js:6148:5)
            at Pk (index-Dw52pmVD.js:6091:36)
            at Gk (index-Dw52pmVD.js:5747:13)
            at J2 (index-Dw52pmVD.js:437:21)
            at MessagePort.R (index-Dw52pmVD.js:465:15)
        (anonymous)	@	index-Dw52pmVD.js:57815
        Promise.catch		
        (anonymous)	@	index-Dw52pmVD.js:57814
        Qj	@	index-Dw52pmVD.js:5009
        Hk	@	index-Dw52pmVD.js:6244
        Ek	@	index-Dw52pmVD.js:5808
        jg	@	index-Dw52pmVD.js:2722
        Wk	@	index-Dw52pmVD.js:6148
        Pk	@	index-Dw52pmVD.js:6091
        Gk	@	index-Dw52pmVD.js:5747
        J2	@	index-Dw52pmVD.js:437
        R	@	index-Dw52pmVD.js:465
        index-Dw52pmVD.js:42633 
        GET https://miniature-space-meme-5g564g65949pcvr9g-6274.app.github.dev:6277/health net::ERR_CONNECTION_TIMED_OUT
        checkProxyHealth	@	index-Dw52pmVD.js:42633
        connect	@	index-Dw52pmVD.js:42698
        Nb	@	index-Dw52pmVD.js:1277
        Tb	@	index-Dw52pmVD.js:1289
        Ub	@	index-Dw52pmVD.js:1292
        nf	@	index-Dw52pmVD.js:2229
        se	@	index-Dw52pmVD.js:2252
        (anonymous)	@	index-Dw52pmVD.js:2524
        Qk	@	index-Dw52pmVD.js:5828
        Jb	@	index-Dw52pmVD.js:1230
        hd	@	index-Dw52pmVD.js:2325
        fd	@	index-Dw52pmVD.js:1723
        ed	@	index-Dw52pmVD.js:1706
        index-Dw52pmVD.js:42639 Couldn't connect to MCP Proxy Server TypeError: Failed to fetch
            at checkProxyHealth (index-Dw52pmVD.js:42633:41)
            at connect (index-Dw52pmVD.js:42698:15)
            at Object.Nb (index-Dw52pmVD.js:1277:9)
            at Tb (index-Dw52pmVD.js:1289:8)
            at Ub (index-Dw52pmVD.js:1292:8)
            at nf (index-Dw52pmVD.js:2229:5)
            at se (index-Dw52pmVD.js:2252:11)
            at index-Dw52pmVD.js:2524:7
            at Qk (index-Dw52pmVD.js:5828:14)
            at Jb (index-Dw52pmVD.js:1230:14)
        checkProxyHealth	@	index-Dw52pmVD.js:42639
        await in checkProxyHealth		
        connect	@	index-Dw52pmVD.js:42698
        Nb	@	index-Dw52pmVD.js:1277
        Tb	@	index-Dw52pmVD.js:1289
        Ub	@	index-Dw52pmVD.js:1292
        nf	@	index-Dw52pmVD.js:2229
        se	@	index-Dw52pmVD.js:2252
        (anonymous)	@	index-Dw52pmVD.js:2524
        Qk	@	index-Dw52pmVD.js:5828
        Jb	@	index-Dw52pmVD.js:1230
        hd	@	index-Dw52pmVD.js:2325
        fd	@	index-Dw52pmVD.js:1723
        ed	@	index-Dw52pmVD.js:1706
        ```
  * Why get the path to `stdio_server.py` but not the `stdio_client.py`?
    * The Inspector launches the server process and acts as a client to test it. You never need to point the Inspector at a client file.


Activate environment again
* Terminal1 - Start server
  ```bash
  @kaiquanmah0 ➜ /workspaces/aidevtools-homework (main) $ cd ./03-v0-lesson-context7/
  @kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7 (main) $ cd code
  @kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ source .venv/bin/activate
  (code) @kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ uv run python 0-mcp-demo/stdio/stdio_server.py


  starting server
  ```
* Terminal2 - Configure port, start MCP Inspector with the relevant settings
  ```bash
  cd ./03-v0-lesson-context7/
  cd code
  source .venv/bin/activate

  # Run port forward in background
  gh codespace ports forward 6277:6277 &
  # Now you can use the same terminal for the npx command
  npx @modelcontextprotocol/inspector \
    /workspaces/aidevtools-homework/03-v0-lesson-context7/code/.venv/bin/python \
    /workspaces/aidevtools-homework/03-v0-lesson-context7/code/0-mcp-demo/stdio/stdio_server.py



    [1] 4772
    ? Choose codespace:  [Use arrows to move, type to filter]
    > KaiquanMah/aidevtools-homework [main*]: aidevtools-homework
    Starting MCP inspector...
    ⚙️ Proxy server listening on localhost:6277
    🔑 Session token: 135e8eca34a8bedf575ff5806f3925e6c146f37b9b90728163a76650ab1d534a
      Use this token to authenticate requests or set DANGEROUSLY_OMIT_AUTH=true to disable auth

    🚀 MCP Inspector is up and running at:
   http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=135e8eca34a8bedf575ff5806f3925e6c146f37b9b90728163a76650ab1d534a




  gh codespace ports
  ? Choose codespace: KaiquanMah/aidevtools-homework [main*]: aidevtools-homework
  LABEL  PORT  VISIBILITY  BROWSE URL
  
  
  gh codespace list
  NAME                                    DISPLAY NAME         REPOSITORY                      BRANCH  STATE      CREATED AT       
  miniature-space-meme-5g564g65949pcvr9g  aidevtools-homework  KaiquanMah/aidevtools-homework  main*   Available  about 29 days ago



  gh codespace ports forward 6277:6277 -c miniature-space-meme-5g564g65949pcvr9g
  Forwarding ports: remote 6277 <=> local 6277
  error connecting to tunnel: connect to forwarded port failed: error connecting to forwarded port: failed to open streaming channel: failed to open port forward channel: failed to open channel: ssh: rejected: connect failed (PortForwardingService received forwarding channel for 127.0.0.1:6277 that was not requested.)
  ```
* Terminal 1 forward port, terminal 2 start MCP inspector
  ```bash
  # terminal 1  
  @kaiquanmah0 ➜ /workspaces/aidevtools-homework (main) $ gh codespace ports
  ? Choose codespace: KaiquanMah/aidevtools-homework [main*]: aidevtools-homework
  LABEL  PORT  VISIBILITY  BROWSE URL
  @kaiquanmah0 ➜ /workspaces/aidevtools-homework (main) $ gh codespace list
  NAME                                    DISPLAY NAME         REPOSITORY                      BRANCH  STATE      CREATED AT       
  miniature-space-meme-5g564g65949pcvr9g  aidevtools-homework  KaiquanMah/aidevtools-homework  main*   Available  about 29 days ago

  @kaiquanmah0 ➜ /workspaces/aidevtools-homework (main) $ gh codespace ports forward 6277:6277 -c miniature-space-meme-5g564g65949pcvr9g
  Forwarding ports: remote 6277 <=> local 6277
  
  
  
  
  
  # terminal 2
  (code) @kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ npx @modelcontextprotocol/inspector \
    /workspaces/aidevtools-homework/03-v0-lesson-context7/code/.venv/bin/python \
    /workspaces/aidevtools-homework/03-v0-lesson-context7/code/0-mcp-demo/stdio/stdio_server.py
  Starting MCP inspector...
  ❌  Proxy Server PORT IS IN USE at port 6277 ❌ 
  ```
* Terminal 1 start MCP inspector, terminal 2 forward port
  ```bash
  # terminal 1  
  (code) @kaiquanmah0 ➜ /workspaces/aidevtools-homework/03-v0-lesson-context7/code (main) $ # Terminal 1: Start Inspector FIRST (will bind to 6277)
  npx @modelcontextprotocol/inspector \
    /workspaces/aidevtools-homework/03-v0-lesson-context7/code/.venv/bin/python \
    /workspaces/aidevtools-homework/03-v0-lesson-context7/code/0-mcp-demo/stdio/stdio_server.py
  Starting MCP inspector...
  ⚙️ Proxy server listening on localhost:6277
  🔑 Session token: e8e646b6802b9732f6f961d954d747bc1ba2cd23be10ea8fe8a261ec1d6b3618
    Use this token to authenticate requests or set DANGEROUSLY_OMIT_AUTH=true to disable auth

  🚀 MCP Inspector is up and running at:
    http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=e8e646b6802b9732f6f961d954d747bc1ba2cd23be10ea8fe8a261ec1d6b3618

  🌐 Opening browser...
  
  
  
  
  
  # terminal 2
  @kaiquanmah0 ➜ /workspaces/aidevtools-homework (main) $ # Terminal 2: THEN forward the port (AFTER inspector is running)
  gh codespace ports forward 6277:6277 -c miniature-space-meme-5g564g65949pcvr9g
  failed to listen to local port over tcp: listen tcp :6277: bind: address already in use
  ```
* Issue trying to get MCP Inspector to work inside GitHub codespace
  * even after trying to forward ports

* Extra Reading
  * Debug MCP in the Terminal - https://github.com/conikeec/mcp-probe
    * Documentation page on Crates.io - https://crates.io/crates/mcp-cli