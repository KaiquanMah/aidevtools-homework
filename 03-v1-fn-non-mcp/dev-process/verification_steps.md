# Verification Steps: Q1 & Q2

## Question 1: Checking the `fastmcp` Wheel Hash

**Goal**: Find the first hash for `fastmcp` in the `wheels` section of `uv.lock`.

1.  **Environment Creation**
    - Created a `Dockerfile` based on `python:3.12-slim`.
    - Included `uv init` and `uv add fastmcp requests` to generate the lockfile during build.

2.  **Lock File Inspection**
    - The `uv.lock` file exists only inside the Docker container.
    - I used a Python one-liner running inside the container to parse the TOML file and extract the exact hash to avoid truncation issues with `cat`.

    ```bash
    docker run --rm mcp-homework python -c "import tomllib; [print(w['hash']) for p in tomllib.load(open('uv.lock', 'rb'))['package'] if p['name'] == 'fastmcp' for w in p['wheels']][0]"
    ```

3.  **Result**
    - **Hash**: `sha256:fb3e365cc1d52573ab89caeba9944dd4b0561449097be169bce428e011f0a57e5`

## Question 2: Checking the FastMCP Transport

**Goal**: Identify the transport protocol used by the server.

1.  **Server Setup**
    - Created `main.py` with `FastMCP("Demo 🚀")`.
    - **Note on Execution**: We use `CMD ["uv", "run", "python", "main.py"]` in the Dockerfile.
        - `python main.py` runs the script directly, which invokes `mcp.run()` at the end. This is standard for Docker containers.
        - `fastmcp run server.py`, by contrast, is a CLI command often used for development (e.g., for auto-reloading).
        - Both methods default to `stdio` transport unless configured otherwise.

2.  **Execution**
    - Ran the Docker container, which executes `uv run python main.py`.

    ```bash
    docker run --rm mcp-homework
    ```

3.  **Observation**
    - The server output explicitly stated the transport mode in the welcome banner.

    ```text
    ╭────────────────────────────────────────────╮
    │  FastMCP Server                            │
    │  ...                                       │
    │  transport 'stdio'                         │
    ╰────────────────────────────────────────────╯
    ```

    - **Answer**: `STDIO`
