# Run MCP Inspector locally using Docker Container
* Reference
  * https://github.com/modelcontextprotocol/inspector?tab=readme-ov-file#docker-container
* Additional Readings
  * https://github.com/alexeygrigorev/toyaikit/tree/main
  * MCP client class and basic fns - https://github.com/alexeygrigorev/toyaikit/blob/main/toyaikit/mcp/client.py
  * Context7 - add to IDE server as 'MCP Server' https://context7.com/docs/usage



```bash
kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework (main)
$ cd 03-v0-lesson-context7/



# yet to start Docker Desktop
kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework/03-v0-lesson-context7 (main)
$ docker run --rm \
  -p 127.0.0.1:6274:6274 \
  -p 127.0.0.1:6277:6277 \
  -e HOST=0.0.0.0 \
  -e MCP_AUTO_OPEN_ENABLED=false \
  ghcr.io/modelcontextprotocol/inspector:latest
docker: error during connect: Head "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/_ping": open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.       

Run 'docker run --help' for more information




# after starting Docker Desktop
kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework/03-v0-lesson-context7 (main)  
$ docker run --rm   -p 127.0.0.1:6274:6274   -p 127.0.0.1:6277:6277   -e HOST=0.0.0.0   -e MCP_AUTO_OPEN_ENABLED=false   ghcr.io/modelcontextprotocol/inspector:latest
Unable to find image 'ghcr.io/modelcontextprotocol/inspector:latest' locally
latest: Pulling from modelcontextprotocol/inspector
b42421530f57: Pulling fs layer
85ce34a7f114: Pulling fs layer                                                             
d4f0be0e8239: Pulling fs layer                                                             
b42421530f57: Pull complete
bf2ae1961a4c: Pull complete
9e7ac5986a8a: Pull complete
cac4aec1f27c: Pull complete
3ab50c87739e: Pull complete
172c9e1a3e90: Pull complete
b93054334b26: Pull complete
79cdc6cbeb68: Pull complete
839c794e5436: Pull complete
21f205f4b728: Pull complete
6e09ae90c8ab: Pull complete
f58d87d1235b: Pull complete
Digest: sha256:d4fda7b69cb8ae4cd9d3ac5b24bea59defc0555b59f90c9b5197c92968f65af1
Status: Downloaded newer image for ghcr.io/modelcontextprotocol/inspector:latest

> @modelcontextprotocol/inspector@0.18.0 start
> node client/bin/start.js

Starting MCP inspector...
⚙️ Proxy server listening on 0.0.0.0:6277
🔑 Session token: 30a5b63dbb3bacbf1bacc23814add99dcf9fac4ce377ef84deca422e28f0cdde
   Use this token to authenticate requests or set DANGEROUSLY_OMIT_AUTH=true to disable auth

🚀 MCP Inspector is up and running at:
   http://0.0.0.0:6274/?MCP_PROXY_AUTH_TOKEN=30a5b63dbb3bacbf1bacc23814add99dcf9fac4ce377ef84deca422e28f0cdde





New StreamableHttp connection request
Query parameters: {"url":"https://mcp.context7.com/mcp","transportType":"streamable-http"}
Created StreamableHttp client transport
Client <-> Proxy  sessionId: 4e3a5105-0b28-4013-8b72-4de869ed342d
Received POST message for sessionId 4e3a5105-0b28-4013-8b72-4de869ed342d
Received GET message for sessionId 4e3a5105-0b28-4013-8b72-4de869ed342d
```



* from terminal working where i run docker - @terminal:bash , i load the URL on a browser but it says
```bash
http://0.0.0.0:6274/?MCP_PROXY_AUTH_TOKEN=30a5b63dbb3bacbf1bacc23814add99dcf9fac4ce377ef84deca422e28f0cdde


Hmmm… can't reach this page
It looks like the webpage at http://0.0.0.0:6274/?MCP_PROXY_AUTH_TOKEN=30a5b63dbb3bacbf1bacc23814add99dcf9fac4ce377ef84deca422e28f0cdde might be having issues, or it may have moved permanently to a new web address.
ERR_ADDRESS_INVALID
```
   * The error ERR_ADDRESS_INVALID is occurring because your browser cannot use 0.0.0.0 as a destination address. While the MCP Inspector inside the Docker container is "listening" on all interfaces (0.0.0.0), you must access it from your computer using localhost or 127.0.0.1.
   * The Fix
     * Replace 0.0.0.0 with localhost in your URL. Use this link instead: `http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=30a5b63dbb3bacbf1bacc23814add99dcf9fac4ce377ef84deca422e28f0cdde`
   * Why did this happen?
     * Inside the container: The server says it's at 0.0.0.0 because it's willing to accept connections from "anywhere" (necessary for Docker networking).
     * Outside the container (Windows): Your Docker command included -p 127.0.0.1:6274:6274, which specifically mapped the container's port to your local machine's 127.0.0.1 (localhost) address.
     * The Browser: Browsers treat 0.0.0.0 as an invalid recipient address, but localhost (or 127.0.0.1) tells it to look at your own machine where Docker is listening.
     * Essentially, -e HOST=0.0.0.0 tells the server inside Docker to listen for connections, while the browser on your computer (the real "host") needs to use localhost to reach it.


# Resolution Plan: Fix MCP Inspector "ERR_ADDRESS_INVALID"

The error occurs because `0.0.0.0` is a meta-address used by the server to say "listen on all network cards," but browsers on Windows can't use it as a destination.

## Proposed Steps

### 1. Manual URL Correction
Replace `0.0.0.0` with `localhost` or `127.0.0.1` in your browser's address bar.

**Original URL:**
`http://0.0.0.0:6274/?MCP_PROXY_AUTH_TOKEN=30a5b63dbb3bacbf1bacc23814add99dcf9fac4ce377ef84deca422e28f0cdde`

**Corrected URL:**
`http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=30a5b63dbb3bacbf1bacc23814add99dcf9fac4ce377ef84deca422e28f0cdde`

### 2. (Optional) Command Optimization
If you want to avoid this in the future, you can update your Docker command or use `npx` directly as suggested in the README (if you have Node.js installed).

## Understanding the Docker Command

Here is what each part of your command does:

| Part | Meaning |
| :--- | :--- |
| `docker run` | Starts a new container from an image. |
| `--rm` | "Remove" - Automatically deletes the container when you stop it. |
| `-p 127.0.0.1:6274:6274` | **Port Mapping.** Connects your computer's port `6274` to the container's port `6274`. The `127.0.0.1` part restricts access ONLY to your local machine (more secure). |
| `-e HOST=0.0.0.0` | **Environment Variable.** Inside the container, this tells the server to listen on all internal network cards. This is necessary so Docker can route traffic to it. |
| `-e MCP_AUTO_OPEN_ENABLED=false` | Prevents the container from trying to open a browser window by itself. |
| `ghcr.io/.../inspector:latest` | The address of the pre-built image to download and run. |

### What does "Host" mean?
In networking, the "Host" usually refers to the machine or interface where a service is running. 
- **Internal Host (`0.0.0.0`):** Inside Docker, setting `HOST=0.0.0.0` means "I'm listening for anyone who knocks on my door." 
- **External Host (`localhost`):** From your Windows perspective, you are the "host" of your own machine. To talk to the container, you use `localhost` because Docker has "mapped" the container's door to your machine's door.

## Verification Plan
1. Paste the corrected URL into your browser: [http://localhost:6274/...](http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=30a5b63dbb3bacbf1bacc23814add99dcf9fac4ce377ef84deca422e28f0cdde)
2. Confirm the MCP Inspector UI loads.


## Verification Screenshots
Go to the localhost URL - http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=30a5b63dbb3bacbf1bacc23814add99dcf9fac4ce377ef84deca422e28f0cdde

MCP Inspector
* transport type - streamable HTTP
* URL
* authentication - <CONTEXT7_API_KEY>
* connect
<img width="905" height="943" alt="connect-context7" src="https://github.com/user-attachments/assets/54aecb8e-d628-42be-962c-69892d37426e" />

* List tools
* click on `resolve-library-id` tool
* libraryName - feature-engine
* Run tool
* Search for the right `context7 library ID`
<img width="1912" height="950" alt="list-tools-n-find-library" src="https://github.com/user-attachments/assets/e1786e3a-7f73-4ac2-9bdd-b0921e70f521" />
<img width="1836" height="942" alt="feature-engine-context7-id" src="https://github.com/user-attachments/assets/df758d61-dc57-4606-b77f-eab275ede28c" />


* click on `get-library-docs` tool
* context7CompatibleLibraryID - `context7 library ID`
* mode - code
* topic - <what you want to search for>
<img width="1865" height="942" alt="get-library-docs-tool" src="https://github.com/user-attachments/assets/3571f180-a760-4867-b3ef-304d5ede4689" />
<img width="1871" height="951" alt="imputation-fns" src="https://github.com/user-attachments/assets/509a93ce-6d7a-4030-b136-4bac8cd0a746" />

