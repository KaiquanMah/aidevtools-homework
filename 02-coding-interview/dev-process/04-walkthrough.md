# Deployment Walkthrough

## Overview
We have successfully deployed the Real-time Code Editor to **Koyeb**.
The application supports:
- Real-time code synchronization via WebSockets.
- Python code execution in the browser using Pyodide (WebAssembly).
- Secure production environment with Nginx.

## Key Challenges & Solutions

### 1. Real-time Sync Logic
- **Issue:** Room-based broadcasts were not working as expected.
- **Fix:** Implemented manual iteration over socket IDs in the room to ensure reliable event delivery.

### 2. Pyodide Crash in Production
- **Issue:** Python execution crashed the browser tab (`STATUS_ACCESS_VIOLATION`) in production.
- **Root Causes:**
    1.  **Main Thread Blocking:** Pyodide was running on the UI thread.
    2.  **Security Headers:** `SharedArrayBuffer` was blocked because Nginx missing COOP/COEP headers.
    3.  **Version Mismatch:** `npm` installed `v0.26.4` but code requested `v0.26.1`.
- **Fixes:**
    1.  Moved Pyodide to a **Web Worker** (`pyodide.worker.js`).
    2.  Added `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` to Nginx.
    3.  Aligned versions to `v0.26.4`.

## Browser Compatibility
- **Chrome:** ✅ Fully Functional.
- **Edge:** ⚠️ Known Issue. May crash if "Enhanced Security Mode" is enabled (which disables JIT compilation required by WASM).

## Deployment Details
- **Platform:** Koyeb
- **URL:** `https://embarrassing-ketti-kaiquanmah-50a82a1c.koyeb.app`
- **Docker:** Multi-stage build (Node.js builder -> Python/Nginx runtime).
