# MCP Server Integration - Implementation Plan

## Overview

This plan addresses the MCP server integration issue where Antigravity gave a misleading response about not being able to use the MCP tools. The root cause is **not a configuration problem** but rather **ambiguous prompting** and a **confusing AI response**.

## User Review Required

> [!IMPORTANT]
> **No Code Changes Needed**
> 
> Your MCP server is correctly configured. The tools are discovered by Antigravity (as shown in your screenshot). The issue is with **how to prompt Antigravity** to use the tools, not with the setup itself.

> [!NOTE]
> **What This Plan Will Do**
> 
> This plan focuses on:
> 1. Verifying your current setup is working
> 2. Providing correct prompts to use with Antigravity
> 3. Troubleshooting any actual connection issues
> 4. (Optional) Optimizing the Docker setup for faster performance

---

## Proposed Changes

### Verification Scripts

#### [NEW] [verify_mcp_setup.bat](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools/verify_mcp_setup.bat)

Windows batch script that:
- Checks if Docker is installed and running
- Verifies the `mcp-homework` image exists (builds if needed)
- Tests the MCP server startup
- Provides next steps for testing in Antigravity

#### [NEW] [verify_mcp_setup.sh](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools/verify_mcp_setup.sh)

Bash equivalent for Git Bash or WSL users.

---

### Documentation Updates

#### [MODIFY] [MCP_SETUP_GUIDE.md](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools/MCP_SETUP_GUIDE.md)

Add a new section explaining:
- Why Antigravity's response was misleading
- How to properly prompt Antigravity to use MCP tools
- Examples of correct vs incorrect prompts
- Troubleshooting steps

#### [NEW] [PROMPTS_FOR_ANTIGRAVITY.md](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools/PROMPTS_FOR_ANTIGRAVITY.md)

A quick reference guide with:
- Template prompts for each tool
- Examples of successful interactions
- Common mistakes to avoid

---

### Optional Optimizations

#### [MODIFY] [Dockerfile](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools/Dockerfile)

**Optional**: Pre-download the FastMCP zip file during image build to eliminate download time on each MCP server start.

Changes:
```dockerfile
# Add after RUN uv add ...
RUN python -c "import requests; \
    r = requests.get('https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip'); \
    open('/app/fastmcp-main.zip', 'wb').write(r.content)"
```

#### [MODIFY] [search.py](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools/search.py)

**Optional**: Modify `setup_search()` to check for cached zip file first:

```python
def setup_search():
    zip_path = "/app/fastmcp-main.zip"
    
    if os.path.exists(zip_path):
        print(f"Using cached zip from {zip_path}")
        with open(zip_path, 'rb') as f:
            zip_content = f.read()
    else:
        url = "https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip"
        print(f"Downloading {url}...")
        response = requests.get(url)
        response.raise_for_status()
        zip_content = response.content
    
    # Process zip_content instead of response.content
    # ... rest of the code
```

---

## Verification Plan

### Automated Verification

#### Step 1: Run Verification Script

```bash
cd c:\Users\kaiqu\Downloads\aidevtools-homework\03-v2-try-to-use-as-mcp-tools
verify_mcp_setup.bat
```

**Expected Output**:
- ✅ Docker is installed
- ✅ Docker daemon is running
- ✅ mcp-homework image found (or built)
- ✅ Server starts successfully (shows FastMCP welcome screen)

#### Step 2: Verify MCP Configuration File

Check that `.agent/mcp_config.json` in your workspace contains:

```json
{
  "mcpServers": {
    "homework-search": {
      "command": "c:/Users/kaiqu/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools/run_mcp_server.bat",
      "args": []
    }
  }
}
```

### Manual Testing in Antigravity IDE

#### Test 1: Verify MCP Server Connection

1. Open Antigravity IDE
2. Click **"..."** → **"MCP Servers"**
3. Verify `homework-search` is listed
4. Check for any error messages

**Expected**: Server shows as available with 3 tools (add, scrape_web_page, search)

#### Test 2: Test the `add` Tool

**Prompt to use**:
```
Please use the add tool from the homework-search MCP server to add 5 and 3.
```

**Expected Response**: 
- Antigravity calls the MCP tool
- Returns: `8`

**If this fails**: There's an actual connection issue (proceed to troubleshooting)

#### Test 3: Test the `search` Tool

**Prompt to use**:
```
Please use the search tool from the homework-search MCP server to search for "demo" in the FastMCP documentation.
```

**Expected Response**:
- Antigravity calls the MCP tool
- Returns search results with filenames and content
- First result should be: `examples/testing_demo/README.md`

**If this fails**: Check Docker logs for errors during search index setup

#### Test 4: Test the `scrape_web_page` Tool

**Prompt to use**:
```
Please use the scrape_web_page tool from the homework-search MCP server to fetch the content from https://datatalks.club/, then count how many times the word "data" appears (case-insensitive).
```

**Expected Response**:
- Antigravity calls the scrape_web_page tool
- Receives the markdown content
- Counts occurrences of "data"
- Should find approximately 61 occurrences

### Troubleshooting Tests

If any of the above tests fail:

#### Check 1: Docker Container Logs

```bash
# Start the server manually
docker run --rm -i mcp-homework uv run python main.py

# In another terminal, check logs
docker ps  # Get container ID
docker logs <container-id>
```

#### Check 2: Test Wrapper Script Directly

```bash
cd c:\Users\kaiqu\Downloads\aidevtools-homework\03-v2-try-to-use-as-mcp-tools
run_mcp_server.bat
```

Should show FastMCP welcome screen. Press Ctrl+C to stop.

#### Check 3: Rebuild Docker Image

```bash
cd c:\Users\kaiqu\Downloads\aidevtools-homework\03-v2-try-to-use-as-mcp-tools
docker build --no-cache -t mcp-homework .
```

Then retry the tests.

---

## Success Criteria

- [ ] Verification script runs without errors
- [ ] MCP server starts and shows FastMCP welcome screen
- [ ] Antigravity IDE shows `homework-search` server as connected
- [ ] `add` tool works correctly (returns 8 for 5+3)
- [ ] `search` tool returns results for "demo" query
- [ ] `scrape_web_page` tool fetches content from a URL
- [ ] User understands how to properly prompt Antigravity to use MCP tools

---

## Timeline

- **Verification**: 5-10 minutes
- **Testing in Antigravity**: 10-15 minutes
- **Troubleshooting** (if needed): 15-30 minutes
- **Optional Optimizations**: 30-45 minutes

---

## Notes

> [!TIP]
> **Key Insight**: The MCP protocol works by having the Antigravity IDE client (running locally) start your MCP server process and communicate with it via stdin/stdout. The AI assistant (running on Google's servers) instructs the IDE client to make these calls. This is why Antigravity's response about "not being able to access local servers" was misleading.

> [!CAUTION]
> **Common Mistake**: Using vague prompts like "use the MCP tools" instead of explicitly specifying which tool and what parameters. Always be explicit about:
> - The MCP server name (`homework-search`)
> - The specific tool (`add`, `search`, or `scrape_web_page`)
> - All required parameters
