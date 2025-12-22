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