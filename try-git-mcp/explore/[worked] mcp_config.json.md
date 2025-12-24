## Worked - No Comments, Use serverUrl only
```json
{
  "mcpServers": {
    "homework-search": {
      "command": "c:/Users/kaiqu/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools/run_mcp_server.bat",
      "args": [],
      "disabled": false,
      "disabledTools": []
    },
    "feature_engine_docs": {
      "serverUrl": "https://gitmcp.io/feature-engine/feature_engine"
    },
    "kai_docs": {
      "serverUrl": "https://gitmcp.io/kaiquanmah/training"
    }
  }
}
```

## Failed - Contain Comments, Use sse type AND url
```json
{
  "mcpServers": {
    "homework-search": {
      "command": "c:/Users/kaiqu/Downloads/aidevtools-homework/03-v2-try-to-use-as-mcp-tools/run_mcp_server.bat",
      "args": [],
      "disabled": false,
      "disabledTools": []
    },
    "feature_engine_docs": {
      // approach1 WORKS - serverUrl only
      // "serverUrl": "https://gitmcp.io/feature-engine/feature_engine"
      // approach2 FAILS - sse type (server-sent event) AND url
      "type": "sse",
      "url": "https://gitmcp.io/feature-engine/feature_engine"
    },
    "kai_docs": {
      "type": "sse",
      "url": "https://gitmcp.io/kaiquanmah/training"
    }
  }
}
```
