# End-to-End Application Development

Tool used: Windsurf IDE in agent mode.

Objective:
- Build an end-to-end application with AI.
- The web-based platform/application will be used for online coding interviews

Application Requirements:
- The app should be able to do the following:
    - **Create a link and share it with candidates**
    - Allow everyone who connects to **edit code in the code panel**
    - **Show real-time updates** to all connected users
    - Support **syntax highlighting for multiple languages**
    - **Execute code safely in the browser**


## AI Development Guidelines

For Windsurf and other AI assistants working on this project:

### Reference Instructions
- Always refer back to this README.md file for architectural decisions
- Follow the specified technology stack:
    - Frontend: React + Vite
    - Backend: Python + FastAPI
    - Database: SQLite
- Prioritize JavaScript for frontend implementation
- Use this file as the single source of truth for project requirements

### Development Workflow
1. Read and understand all requirements before implementation
2. Cross-reference implementation decisions with this README
3. Update this file when making architectural changes
4. Use the question sections as implementation milestones

### Feature Implementation Order

#### **Phase 1: Q1 - Basic Frontend + Backend Setup**
1. **Initialize Frontend**
   - Create React + Vite project: `npm create vite@latest frontend -- --template react`
   - Install dependencies: React Router, Socket.io-client, Axios
   - Setup basic folder structure: src/components, src/hooks, src/services

2. **Initialize Backend**
   - Create FastAPI project: `mkdir backend && cd backend`
   - Install dependencies: FastAPI, uvicorn, websockets, python-socketio
   - Setup basic folder structure: app/api, app/models, app/services

3. **Establish Communication**
   - Implement WebSocket connection between frontend and backend
   - Create basic API endpoints for room management
   - Test basic client-server connectivity

4. **Basic UI Components**
   - Create main layout with code editor panel
   - Implement room creation and sharing functionality
   - Add basic user presence indicators

#### **Phase 2: Q2 - Integration Tests + TESTS.md**
1. **Testing Setup**
   - Frontend: Install React Testing Library, Jest
   - Backend: Install pytest, pytest-asyncio, httpx
   - Create test folder structure

2. **Integration Tests**
   - Test WebSocket connection establishment
   - Test API endpoint responses
   - Test basic real-time synchronization

3. **Create TESTS.md**
   - Document all testing commands
   - Include frontend test commands: `npm test`
   - Include backend test commands: `pytest backend/`
   - Add integration test commands

#### **Phase 3: Q3 - Concurrent Development Setup**
1. **Install Concurrently**
   - Add to root package.json: `npm install --save-dev concurrently`

2. **Configure Scripts**
   - Add `npm run dev:frontend` and `npm run dev:backend`
   - Create main `npm dev` script using 'concurrently'
   - What's the command you have in `package.json` for `npm dev` for running both?
   - Test both services running simultaneously

3. **Development Workflow**
   - Ensure hot reload works for both frontend and backend
   - Verify WebSocket reconnection on server restart

#### **Phase 4: Q4 - Syntax Highlighting**
1. **Choose Library**
   - Research and select syntax highlighting library (e.g., Monaco Editor, CodeMirror, Prism.js)
   - Install chosen library with required language packages

2. **Implementation**
   - Integrate syntax highlighting into code editor component
   - Add support for JavaScript and Python
   - Implement language selection functionality
   - Test highlighting performance with large files

#### **Phase 5: Q5 - WASM Code Execution**
1. **Security Setup**
   - Research WASM Python compilation libraries (e.g., Pyodide, Brython)
   - Install chosen WASM library

2. **Implementation**
   - Create secure code execution environment in browser
   - Implement JavaScript execution (eval or sandbox)
   - Implement Python execution via WASM
   - Add output display and error handling
   - Ensure no server-side code execution

3. **Safety Measures**
   - Add execution time limits
   - Implement resource usage monitoring
   - Add kill switch for running code

#### **Phase 6: Q6 - Docker Containerization**
1. **Create Dockerfile**
   - Choose appropriate base image (e.g., node:18-alpine)
   - Multi-stage build for frontend optimization
   - Include Python runtime for backend
   - Copy both frontend and backend code

2. **Configuration**
   - Expose necessary ports
   - Set environment variables
   - Configure health checks

3. **Testing**
   - Build Docker image: `docker build -t coding-interview-app .`
   - Test container functionality
   - Verify WebSocket connections work in container

#### **Phase 7: Q7 - Cloud Deployment**
1. **Choose Platform**
   - Evaluate options: Vercel, Heroku, AWS, Google Cloud
   - Consider WebSocket support and ease of deployment

2. **Deployment Setup**
   - Configure platform-specific settings
   - Set up environment variables
   - Configure domain and SSL

3. **Production Testing**
   - Test all features in production environment
   - Verify multi-user collaboration works
   - Test code execution security
   - Performance testing with multiple users




## Development Standards

### Code Quality
- Use ES6+ syntax for JavaScript
- Follow PEP 8 for Python code
- Implement proper error handling
- Use TypeScript for type safety (optional but recommended)
- Write self-documenting code with clear variable/function names

### Security Guidelines
- Never execute user code directly on server
- Use WebAssembly for code execution
- Implement proper input validation
- Use CORS policies appropriately
- Sanitize all user inputs

### Real-time Features
- Use WebSockets for real-time collaboration
- Implement proper connection management
- Handle disconnection/reconnection scenarios
- Sync code changes across all connected users





## Architecture Guidelines

### Frontend Structure
- Component-based architecture with React
- State management using hooks or context
- Modular component organization
- Responsive design principles
- Accessibility compliance

### Backend Structure
- RESTful API design with FastAPI
- Proper HTTP status codes
- API documentation with OpenAPI/Swagger
- Database integration (if needed)
- Session management for interview rooms

### Communication Protocol
- WebSocket events for real-time updates
- REST API for CRUD operations
- Proper error response format
- Rate limiting considerations




## Testing Requirements

### Frontend Testing
- Unit tests with React Testing Library
- Component integration tests
- E2E tests for user workflows
- Browser compatibility testing

### Backend Testing
- API endpoint testing
- WebSocket connection testing
- Load testing for concurrent users
- Security testing for code execution

### Integration Testing
- Client-server communication
- Real-time synchronization
- Code execution safety - let's use WASM to execute the code only in the browser. Also let me know which library you use for compiling Python to WASM.
- Multi-user collaboration scenarios







## Question 1: Initial Implementation

Ask AI to implement both frontend and backend - in 1 prompt.

Note: you can also follow the same path as in the videos and make it in 3 steps:

1. Frontend
2. OpenAPI specs
3. Backend

What's the initial prompt you gave to AI to start the implementation? Copy and paste it in the homework form.
```
@02-coding-interview  please think step by step to topup README.md. What instructions can be added to this readme.md file to help windsurf keep referring back to this file for coding instructions / guidelines???? what coding guidelines can be added?


@02-coding-interview. pls think step by step the plan to create the solution, then top up the feature implementation order subsection.

pls read readme.md inside @02-coding-interview  folder. Then think step by step how to implement the code in @02-coding-interview , starting from phase 1.
Also is there a way to install things in a separate environment, so it does not mess with my computer? Create a Docker development environment first, then implement the project.
```



## Question 2: Integration Tests

Write integration tests that check the interaction between client and server works.

Also it's a good idea to ask it to start creating a `TESTS.md` file with all the commands for running and testing your application.

What's the terminal command you use for executing tests?

**2.1 Backend and Integration Test Command**
```bash
docker-compose -f docker-compose.dev.yml exec dev python3 -m pytest backend/ -v
```


**2.2 Frontend Test Command**
```bash
docker-compose -f docker-compose.dev.yml exec dev sh -c "cd frontend && npm test"
```



## Question 3: Running Both Client and Server

Now let's make it possible to run both client and server at the same time. Use `concurrently` for that.

What's the command you have in `package.json` for `npm dev` for running both?

```json
"dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
```

This command uses `concurrently` to run two npm scripts in parallel:
- `dev:backend` - Runs the FastAPI backend with uvicorn
- `dev:frontend` - Runs the Vite dev server for React

**Note**
* In our Docker setup, we actually use `entrypoint.sh` to start both services automatically when the container starts, so the `concurrently` command is **available but not actively used in the containerized workflow**.
* The concurrently command in package.json is NOT actually used in our Docker setup. It's there as an alternative option for running the app outside of Docker (directly on your local/host machine).





## Question 4: Syntax Highlighting

Let's now add support for syntax highlighting for JavaScript and Python.

Which library did we use for syntax highlighting?
* Monaco Editor (@monaco-editor/react) version ^4.7.0
* it is a React wrapper for the Monaco Editor - the same editor that powers VS Code.

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
- **Theme support** (we used `vs-dark`)
- **Real-time updates** via the `onChange` callback



## Question 5: Code Execution

Now let's add code execution.

For security reasons, we don't want to execute code directly on the server. Instead, let's use WASM to execute the code only in the browser.


WASM = WebAssembly
* WebAssembly is a way to run code written in other programming languages (like C++, Rust, JS, Python) directly in your web browser, at near-native speed.
* Your JavaScript app can call WASM code when it needs a performance boost
* WASM files are often smaller than equivalent JavaScript
* Teams can **reuse existing code written in other languages**
* WebAssembly is actually a binary instruction format - think of it like a compiled file format that contains instructions that can be executed by a VM.
* There IS a VM that runs it - Browsers have dedicated WebAssembly engines/VMs that execute WASM code.



Which library did we use for compiling Python to WASM?
1. **`pyodide`** version 0.26.4 (npm package) - Python runtime compiled to WebAssembly
  * For Python execution and native JavaScript execution for JS code
  * Pyodide is a Python distribution that runs in the browser. It is a self-contained Python distribution that can be used to run Python code in the browser.
2. **Web Workers** - To run Pyodide in a background thread
  * This fixed the issue of blocking the main thread during Python execution


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
- **Prevents UI freezing during heavy computation**
- Isolates crashes (if Python code crashes, only worker dies, not the tab)
- Required for production (security headers COOP/COEP)

**Security Headers Required:**
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

These headers enable `SharedArrayBuffer`, which Pyodide needs for memory management.





## Question 6: Containerization

Now let's containerize our application. Ask AI to help you create a Dockerfile for the application. Put BOTH backend and frontend in 1 container.

What's the BASE IMAGE you used for your Dockerfile?
* We used a **multi-stage build** with 2 different base images.

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
  - Because we use a multi-stage Docker build - we build the frontend in Stage 1, then **only copy the compiled output to Stage 2 / Final Production Image**.
  - What gets LEFT BEHIND in Stage 1:
    - Node.js runtime
    - npm
    - Vite
    - React source code (.jsx files)
    - node_modules (thousands of packages)
  - What gets COPIED to Stage 2:
    - Only the **compiled static files (index.html, bundle.js, styles.css)**
    - Where are these compiled static files found?
      - In Stage 1 (Build Stage):
        - When npm run build executes in the Docker container:
         ```dockerfile
         # Stage 1
         WORKDIR /app/frontend
         RUN npm run build
         ```
         Vite creates the compiled files in:
         ```
         /app/frontend/dist/
         ```
      - This stage 1 compiled static files directory contains:
         - index.html - Main HTML file
         - assets/ - Folder with:
           - index-[hash].js - Bundled JavaScript
           - index-[hash].css - Bundled CSS
           - Other assets (images, fonts, etc.)   
      - In Stage 2 (Final Production Image Stage):
        - The compiled static files are copied from Stage 1:
         ```dockerfile
         # Stage 2
         WORKDIR /app/frontend
         COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist
         ```
         So in the final production container, they're located at:
         ```
         /app/frontend/dist/
         ```
      - Nginx Configuration
        - Nginx is configured to serve these files:
         ```nginx
         location / {
             root /app/frontend/dist;  # ← Serves files from here
             index index.html index.htm;
             try_files $uri $uri/ /index.html;
         }
         ```
      - On Your Local Machine (if you build locally):
        - If you run npm run build in the frontend folder on your computer, the files would be created at:
        ```
        <user-folder>\aidevtools-homework\02-coding-interview\frontend\dist\
        ```
      - Summary:
        - Build location (Stage 1): /app/frontend/dist/ (inside Docker)
        - Production location (Stage 2): /app/frontend/dist/ (copied from Stage 1)
        - Nginx serves from: /app/frontend/dist/
  - Benefits:
    - Faster deployments: Less data to transfer
    - Security: Fewer tools = smaller attack surface
    - Efficiency: Production only needs to serve static files, not build them
- **Single container:** Nginx serves frontend + proxies backend
- **Port 80:** Single entry point for the entire application





## Question 7: Deployment

Now let's deploy it. Choose a service to deploy your application.

Which SERVICE did you use for deployment?
* Koyeb hosting service
* Hosted web application is available at https://embarrassing-ketti-kaiquanmah-50a82a1c.koyeb.app/ (free tier)
* Please note that if limits are reached, please test the app locally on your computer instead
