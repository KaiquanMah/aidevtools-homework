## Question 3: Running Both Client and Server

Now let's make it possible to run both client and server at the same time. Use `concurrently` for that.

What's the command you have in `package.json` for `npm dev` for running both?

**Answer:**
```json
"dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
```

This command uses `concurrently` to run two npm scripts in parallel:
- `dev:backend` - Runs the FastAPI backend with uvicorn
- `dev:frontend` - Runs the Vite dev server for React

> **Note**: In our Docker setup, we actually use `entrypoint.sh` to start both services automatically when the container starts, so the concurrently command is available but not actively used in the containerized workflow.


## Question 4: Syntax Highlighting

For syntax highlighting, what library did you use? How does it work?

**Answer:**
We used **`@monaco-editor/react`** (version ^4.7.0), which is a React wrapper for the Monaco Editor - the same editor that powers VS Code.

**How it works:**
```jsx
import Editor from '@monaco-editor/react';

<Editor
  height="100%"
  language={language}  // 'javascript' or 'python'
  value={code}
  onChange={handleEditorChange}
  theme="vs-dark"
  options={{
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
  }}
/>
```

**Key Features:**
- **Built-in syntax highlighting** for JavaScript and Python
- **IntelliSense** (code completion)
- **Automatic language detection** based on the `language` prop
- **Theme support** (we use `vs-dark`)
- **Real-time updates** via the `onChange` callback


## Question 5: Code Execution (WASM)

To implement WASM for code execution, what libraries did you use? How does it work?

**Answer:**
We used **Pyodide** (version 0.26.4) for Python execution and native JavaScript execution for JS code.

**Libraries Used:**
1. **`pyodide`** (npm package) - Python runtime compiled to WebAssembly
2. **Web Workers** - To run Pyodide in a background thread

**How it works:**

**For JavaScript:**
- Executes directly in the browser using `new Function(code)`
- Captures `console.log` output by overriding the console object
- Runs on the main thread (safe for simple JS)

**For Python (Pyodide + Web Worker):**
1. **Web Worker Setup** (`pyodide.worker.js`):
   ```javascript
   import { loadPyodide } from 'pyodide';
   
   // Load Pyodide WASM runtime
   pyodide = await loadPyodide({
       indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
   });
   ```

2. **Main Thread** (`useCodeExecutor.js`):
   ```javascript
   // Create worker
   workerRef.current = new Worker(
       new URL('../workers/pyodide.worker.js', import.meta.url),
       { type: 'module' }
   );
   
   // Send code to worker
   workerRef.current.postMessage({ type: 'run', code });
   ```

3. **Worker executes Python** and sends results back to main thread

**Why Web Worker?**
- Prevents UI freezing during heavy computation
- Isolates crashes (if Python code crashes, only worker dies, not the tab)
- Required for production (security headers COOP/COEP)

**Security Headers Required:**
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

These headers enable `SharedArrayBuffer`, which Pyodide needs for memory management.


## Question 6: Docker Base Images

What's the BASE IMAGE deployed to the cloud service, that you used for the full frontend-backend Dockerfile?

**Answer:**
We use a **multi-stage build** with two different base images:

**Stage 1 - Frontend Builder:**
```dockerfile
FROM node:18-alpine as frontend-builder
```
- **Purpose:** Build the React frontend
- **Base:** `node:18-alpine` (lightweight Node.js 18 on Alpine Linux)
- **Output:** Static files in `/app/frontend/dist`

**Stage 2 - Final Production Image:**
```dockerfile
FROM python:3.11-slim
```
- **Purpose:** Run the backend and serve the frontend
- **Base:** `python:3.11-slim` (Debian-based Python 3.11)
- **Includes:**
  - Python 3.11 runtime
  - Nginx (installed via apt-get)
  - Gunicorn (installed via pip)
  - Frontend static files (copied from Stage 1)

**Why this approach?**
- **Smaller final image:** Frontend build tools aren't included in production
- **Single container:** Nginx serves frontend + proxies backend
- **Port 80:** Single entry point for the entire application
