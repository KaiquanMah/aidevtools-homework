## Question 1: How to check for the 1st fastmcp Wheel Hash

Get the 1st wheel hash
```bash
kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework (main)
$ docker run --rm mcp-homework python -c "import tomllib; [print(w['hash']) for p in tomllib.load(open('uv.lock', 'rb'))['package'] if p['name'] == 'fastmcp' for w in p['wheels']][0]"
sha256:fb3e365cc1d52573ab89caeba9944dd4b056149097be169bce428e011f0a57e5
```

Check for presence of all wheel hashes
```bash
kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework (main)
$ docker run --rm mcp-homework python -c "import tomllib; [print(w['hash']) for p in tomllib.load(open('uv.lock', 'rb'))['package'] if p['name'] == 'fastmcp' for w in p['wheels']]"
sha256:fb3e365cc1d52573ab89caeba9944dd4b056149097be169bce428e011f0a57e5
```

**Why is there only one hash?**
Based on the wheel URL (`fastmcp-2.14.1-py3-none-any.whl`), `fastmcp` is a **pure Python package**. It doesn't have platform-specific binaries (like one for Windows, one for Linux), so the maintainers only release a single "universal" wheel that works everywhere. Thus, only one hash exists in the lockfile.




## In question 2, what is the difference between "fastmcp run server.py" (from fastmcp documentation) vs "CMD ["uv", "run", "python", "main.py"]" in dockerfile

`fastmcp run server.py` is the **command-line interface (CLI) way to start the server**, often used for **development** because it supports features like **auto-reloading when files change.**

`python main.py` (which you are running via **uv run in Docker) executes the script directly** as a standard Python program. This works because your `main.py` includes this block at the bottom:
```python
if __name__ == "__main__":
    mcp.run()
```

Key Differences
|Feature	|`fastmcp run main.py`|`python main.py`|
|---|---|---|
|How it starts	|Uses the fastmcp CLI tool to import and run your app.	|Runs the Python interpreter directly.|
|Entry Point	|Expects to find an MCP object in the file.	|**Requires mcp.run()** to be called in the script.|
|Development	|Often supports auto-reload (updates on save).	|Standard execution (**no auto-reload by default**).|
|Production/Docker	|Can be used, but less explicit.	|Preferred. Explicitly runs the script; standard for Docker.|

In this homework, using python main.py inside the Docker CMD is perfectly fine and standard. It ensures the script creates the server and hands over control via mcp.run(), which sets up the stdio transport just like the CLI would.


```bash
kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework (main)
$ docker run --rm mcp-homework


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


[12/22/25 03:41:03] INFO     Starting MCP server 'Demo 🚀' with   server.py:2527
                             transport 'stdio'
```


## Question 3: Web Scrape Tool

**Implementation**
* To **get/convert content of any webpage to Markdown**, add `r.jina.ai` in front of the address. For example: `https://r.jina.ai/https://datatalks.club`
* This uses the `Jina reader`
* So we implemented `scrape_web_page` in `main.py` using `requests` to fetch `https://r.jina.ai/{url}`.
* To facilitate testing, we refactored the logic into `_scrape_web_page` so it can be **imported and tested without the FastMCP decorator interference.**

**Testing**
Created `test_scrape.py` to scrape `https://github.com/alexeygrigorev/minsearch`.

**How to run the test in Docker (if no local Python)**
Use the Docker container to run the test script `test_scrape.py`

1.  **Rebuild the image** (to ensure `test_scrape.py` is inside):
    ```bash
    docker build -t mcp-homework .
    ```

2.  **Run the script** using `uv run` inside the container:
    ```bash
    docker run --rm mcp-homework uv run python test_scrape.py
    ```


**Result**
```bash
kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework/03-mcp (main)
$ docker build -t mcp-homework .
[+] Building 14.2s (14/14) FINISHED                                                                          docker:desktop-linux
 => [internal] load build definition from Dockerfile                                                                         0.0s
 => => transferring dockerfile: 787B                                                                                         0.0s 
 => [internal] load metadata for docker.io/library/python:3.12-slim                                                          3.1s 
 => [internal] load metadata for ghcr.io/astral-sh/uv:latest                                                                 1.1s 
 => [auth] library/python:pull token for registry-1.docker.io                                                                0.0s
 => [internal] load .dockerignore                                                                                            0.0s
 => => transferring context: 2B                                                                                              0.0s 
 => FROM ghcr.io/astral-sh/uv:latest@sha256:5713fa8217f92b80223bc83aac7db36ec80a84437dbc0d04bbc659cae030d8c9                 0.0s 
 => => resolve ghcr.io/astral-sh/uv:latest@sha256:5713fa8217f92b80223bc83aac7db36ec80a84437dbc0d04bbc659cae030d8c9           0.0s 
 => [stage-0 1/6] FROM docker.io/library/python:3.12-slim@sha256:fa48eefe2146644c2308b909d6bb7651a768178f84fc9550dcd495e4d6  0.0s 
 => => resolve docker.io/library/python:3.12-slim@sha256:fa48eefe2146644c2308b909d6bb7651a768178f84fc9550dcd495e4d6d84d01    0.0s
 => [internal] load build context                                                                                            0.0s 
 => => transferring context: 11.01kB                                                                                         0.0s 
 => CACHED [stage-0 2/6] COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv                                                 0.0s 
 => CACHED [stage-0 3/6] WORKDIR /app                                                                                        0.0s 
 => [stage-0 4/6] COPY . /app                                                                                                0.0s 
 => [stage-0 5/6] RUN uv init                                                                                                0.8s 
 => [stage-0 6/6] RUN uv add fastmcp requests                                                                                3.9s 
 => exporting to image                                                                                                       6.1s 
 => => exporting layers                                                                                                      4.1s 
 => => exporting manifest sha256:7b97902251dea87ecdc70847b8b601b76bde6bfb17ee82adabdfc78a6d734adc                            0.0s 
 => => exporting config sha256:b42e71d50df9a9163838e5d52850e8b69136e349fa3a5bc807dbf560b75de867                              0.0s 
 => => exporting attestation manifest sha256:03127c64a2f69ec073596a46b2322a164d3ba9992e4590cf3c0291f3327f976c                0.0s 
 => => exporting manifest list sha256:31cfef3b585ba32cd923ade71243e683794e8285e84736adc12bf758f5dbce14                       0.0s 
 => => naming to docker.io/library/mcp-homework:latest                                                                       0.0s 
 => => unpacking to docker.io/library/mcp-homework:latest                                                                    1.9s 



kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework/03-mcp (main)
$ docker run --rm mcp-homework uv run python test_scrape.py
Starting test_scrape...
Scraping URL: https://github.com/alexeygrigorev/minsearch
Content type: <class 'str'>
Content length: 31361
First 100 chars: Title: GitHub - alexeygrigorev/minsearch: Minimalistic text search engine that uses sklearn and pand
```

The content length returned was **31,361** characters.
Comparing to options:
* 1184
* 9184
* 19184
* 29184
The closest option is **29,184**.


## Question 4: Integrate the Tool

Created `count_data.py` which:
1. Uses `scrape_web_page` to fetch `https://datatalks.club/`.
2. Counts occurrences of the word "data".

**Result**
```bash
kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework/03-mcp (main)
$ docker build -t mcp-homework .

kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework/03-mcp (main)
$ docker run --rm mcp-homework uv run python count_data.py

Scraping URL: https://datatalks.club/
Count of 'data' (case-insensitive): 61
Count of 'data' (exact match): 50
```

Comparing to options:
* 61
* 111
* 161
* 261

The match is **61**.


## Question 5: Implement Search

**Experiment**
Created `search.py` which:
1. Downloads `fastmcp` main branch zip.
2. Reads `.md` and `.mdx` files from the zip.
3. Indexes content using `minsearch`.
4. Searches for "demo".

**Result**
```bash
kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework/03-mcp (main)
$ docker run --rm mcp-homework uv run python search.py

Downloading https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip...
Processing zip file...
Indexed 6 documents.
Searching for query: 'demo'

Results:
1. examples/testing_demo/README.md
2. docs/servers/context.mdx
3. docs/python-sdk/fastmcp-settings.mdx
4. README.md
5. docs/python-sdk/fastmcp.mdx

First file returned: examples/testing_demo/README.md
```

Comparing to options:
* README.md
* docs/servers/context.mdx
* examples/testing_demo/README.md
* docs/python-sdk/fastmcp-settings.mdx

The first file returned is **examples/testing_demo/README.md**.


## Question 6: Search Tool Integration 

Modifed `main.py` to:
1. Import and run `setup_search()` at the top level to initialize the global index.
2. Register a new `@mcp.tool` called `search` that queries the index.

**Verification**
Created `test_search_tool.py` which imports `_search` from `main.py` and runs it.
Successful execution shows that `setup_search` runs on import and the search logic returns results.

```bash
kaiqu@kai-aftershock MINGW64 ~/Downloads/aidevtools-homework/03-mcp (main)
$ docker run --rm mcp-homework uv run python test_search_tool.py


Downloading https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip...
Processing zip file...
Indexed 239 documents.
Testing search tool with query: 'demo'
Search successful!
Result length: 36781
First 200 chars:
Header: examples/testing_demo/README.md
Content: # FastMCP Testing Demo

A comprehensive example demonstrating FastMCP testing patterns with pytest-asyncio.

## Overview

This example shows how to:
- ...
```


## How to offer Search via Webpage/User Interface

We have 2 main options to offer a GUI for your MCP server/tools:

**Option 1: Use the built-in FastMCP Inspector**
**FastMCP comes with a built-in UI for inspecting and running tools.**
Since you are running in Docker, you would need to expose the port (usually 8000 or similar) and run:
`fastmcp dev main.py`
This converts the CLI transport to a server you can visit in your browser.

**Option 2: Custom Streamlit App (Recommended for Demo)**
I have created a `streamlit_ui.py` which provides a simple search box.
This connects directly to your search logic in `main.py`.

To run it:
1. **Rebuild the image** (I have already updated Dockerfile to include `streamlit`):
   ```bash
   docker build -t mcp-homework .
   ```

2. **Run with port mapping**:
   ```bash
   docker run -p 8501:8501 --rm mcp-homework uv run streamlit run streamlit_ui.py
   ```

3. Open your browser at `http://localhost:8501`.
