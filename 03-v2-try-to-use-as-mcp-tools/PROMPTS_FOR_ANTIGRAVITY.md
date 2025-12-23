# Antigravity MCP Prompts - Quick Reference

This guide provides ready-to-use prompts for interacting with your `homework-search` MCP server in Antigravity IDE.

---

## Understanding the Issue

When you previously asked:
```
use @mcp:homework-search: to find how many times the word 'data' appears
```

Antigravity gave a confusing response saying it "cannot access local servers." **This was misleading!**

The MCP tools ARE available and working. You just need to be more explicit in your prompts.

---

## How MCP Actually Works

```
You (User) 
  ↓
Antigravity AI (on Google servers)
  ↓ [instructs]
Antigravity IDE Client (on your local machine)
  ↓ [starts process]
run_mcp_server.bat
  ↓ [runs]
Docker Container with main.py
  ↓ [returns results via STDIO]
Antigravity IDE Client
  ↓ [displays]
You see the results!
```

The AI doesn't directly connect to your MCP server. It tells the IDE client to do it. This is by design!

---

## Correct Prompt Templates

### Tool 1: `add` (Simple Test)

**Purpose**: Add two numbers (good for testing MCP connection)

**Prompt Template**:
```
Please use the add tool from the homework-search MCP server to add [NUMBER1] and [NUMBER2].
```

**Example**:
```
Please use the add tool from the homework-search MCP server to add 5 and 3.
```

**Expected Result**: `8`

---

### Tool 2: `search` (Search FastMCP Documentation)

**Purpose**: Search the indexed FastMCP documentation

**Prompt Template**:
```
Please use the search tool from the homework-search MCP server to search for "[QUERY]" in the FastMCP documentation.
```

**Example 1**:
```
Please use the search tool from the homework-search MCP server to search for "demo" in the FastMCP documentation.
```

**Expected Result**: 
- Returns 5 search results
- First result: `examples/testing_demo/README.md`

**Example 2**:
```
Please use the search tool from the homework-search MCP server to find information about "testing" in the FastMCP documentation.
```

**Example 3**:
```
Use the homework-search MCP server's search tool to look up "context" in the documentation.
```

---

### Tool 3: `scrape_web_page` (Fetch Web Content)

**Purpose**: Scrape any web page and convert to markdown

**Prompt Template**:
```
Please use the scrape_web_page tool from the homework-search MCP server to fetch the content from [URL].
```

**Example 1** (Simple scrape):
```
Please use the scrape_web_page tool from the homework-search MCP server to fetch the content from https://datatalks.club/.
```

**Example 2** (Scrape + Analysis):
```
Please use the scrape_web_page tool from the homework-search MCP server to fetch the content from https://datatalks.club/, then count how many times the word "data" appears (case-insensitive).
```

**Expected Result**: Should find approximately 61 occurrences

**Example 3** (Multi-step):
```
1. Use the scrape_web_page tool from the homework-search MCP server to get the content of https://github.com/alexeygrigorev/minsearch
2. Tell me how many characters are in the result
```

**Expected Result**: Approximately 31,361 characters

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Too Vague

**Bad**:
```
use the MCP tools to search for something
```

**Why it fails**: Doesn't specify which server, which tool, or what parameters

**Good**:
```
Please use the search tool from the homework-search MCP server to search for "demo".
```

---

### ❌ Mistake 2: Missing Parameters

**Bad**:
```
Use the scrape_web_page tool from homework-search
```

**Why it fails**: Doesn't provide the URL parameter

**Good**:
```
Please use the scrape_web_page tool from the homework-search MCP server to fetch https://datatalks.club/
```

---

### ❌ Mistake 3: Ambiguous Intent

**Bad**:
```
use @mcp:homework-search: to find how many times the word 'data' appears
```

**Why it fails**: 
- Doesn't specify which tool (search or scrape_web_page?)
- Doesn't provide a URL to scrape
- Doesn't specify what to search in

**Good**:
```
Please use the scrape_web_page tool from the homework-search MCP server to fetch https://datatalks.club/, then count occurrences of "data".
```

---

## Troubleshooting

### If Antigravity says "Cannot access MCP server"

This is likely a misleading response. Try:

1. **Be more explicit** in your prompt
2. **Test with the simple `add` tool first**:
   ```
   Please use the add tool from the homework-search MCP server to add 10 and 20.
   ```
3. **Check MCP server status** in IDE:
   - Click "..." → "MCP Servers"
   - Verify `homework-search` is listed

### If Tools Actually Don't Work

Run the verification script:
```bash
cd c:\Users\kaiqu\Downloads\aidevtools-homework\03-v2-try-to-use-as-mcp-tools
verify_mcp_setup.bat
```

Check:
- Is Docker running?
- Does the `mcp-homework` image exist?
- Does the server start correctly?

---

## Advanced: Combining Multiple Tools

You can ask Antigravity to use multiple tools in sequence:

**Example**:
```
1. Use the search tool from homework-search to find information about "context" in the FastMCP docs
2. Use the scrape_web_page tool to fetch the first URL mentioned in the results
3. Summarize what you found
```

---

## Testing Checklist

Use these prompts in order to verify everything works:

- [ ] **Test 1**: `Please use the add tool from the homework-search MCP server to add 5 and 3.`
  - Expected: `8`

- [ ] **Test 2**: `Please use the search tool from the homework-search MCP server to search for "demo".`
  - Expected: Returns search results, first file is `examples/testing_demo/README.md`

- [ ] **Test 3**: `Please use the scrape_web_page tool from the homework-search MCP server to fetch https://datatalks.club/ and count how many times "data" appears.`
  - Expected: Approximately 61 occurrences

---

## Quick Reference Table

| Tool | Purpose | Required Parameters | Example |
|------|---------|-------------------|---------|
| `add` | Add two numbers | `a` (int), `b` (int) | `add 5 and 3` |
| `search` | Search FastMCP docs | `query` (string) | `search for "demo"` |
| `scrape_web_page` | Fetch web content | `url` (string) | `fetch https://datatalks.club/` |

---

## Summary

**Key Takeaways**:
1. Your MCP server IS working correctly
2. Antigravity's response about "cannot access" was misleading
3. Use explicit prompts that specify:
   - Server name: `homework-search`
   - Tool name: `add`, `search`, or `scrape_web_page`
   - All required parameters
4. Test with the simple `add` tool first to verify connection

**Your Docker-based approach is excellent** and avoids needing to install `uv` locally!
