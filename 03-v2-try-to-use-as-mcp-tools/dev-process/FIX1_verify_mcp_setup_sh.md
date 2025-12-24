# Walkthrough - Fixing verify_mcp_setup.sh

I investigated why Step 4 of the verification script was failing even though the server started correctly when run manually.

## The Problem

The original script used the following command:
```bash
timeout 3s docker run ... | head -n 30
```

There were two issues with this approach when running in a shell like Git Bash:

1.  **Exit Code Masking**: By default, a pipe (`|`) returns the exit code of the *last* command in the chain. Even though `timeout` correctly exited with code `124` (signaling a successful timeout), the `head` command exited with code `0`. The script was checking specifically for code `124`, so it defaulted to the "unexpected exit" warning.
2.  **Output Buffering**: When output is piped, many programs switch to "block buffering." Because `timeout` killed the process quickly, the output buffer often wasn't flushed to the screen, making it look like the server never started.

## The Fix

I updated [verify_mcp_setup.sh](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools/verify_mcp_setup.sh) with the following changes:

-   Added `set -o pipefail`: This ensures that if `timeout` exits with code `124`, that code is preserved through the pipe.
-   Removed `| head -n 30`: This prevents the buffering issue and allows you to see the full server startup banner.

## Verification Results

I verified the fix by running the updated script. The exit code is now correctly captured, and the success message is displayed:

```text
Step 4: Testing the MCP server startup...
   Starting server for 3 seconds to verify it works...

[FastMCP Banner appears here...]

✅ Server started successfully (timed out as expected)
```

The script now correctly validates your Docker-based MCP setup!
