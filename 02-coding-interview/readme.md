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
Enter here later
```

## Question 2: Integration Tests

Write integration tests that check the interaction between client and server works.

Also it's a good idea to ask it to start creating a `TESTS.md` file with all the commands for running and testing your application.

What's the terminal command you use for executing tests?
```
enter here later
```


## Question 3: Running Both Client and Server

Now let's make it possible to run both client and server at the same time. Use `concurrently` for that.

What's the command you have in `package.json` for `npm dev` for running both?
```
enter here later
```

## Question 4: Syntax Highlighting

Let's now add support for syntax highlighting for JavaScript and Python.

Which library did AI use for it?
```
enter here later
```


## Question 5: Code Execution

Now let's add code execution.

For security reasons, we don't want to execute code directly on the server. Instead, let's use WASM to execute the code only in the browser.

Which library did AI use for compiling Python to WASM?
```
enter here later
```


## Question 6: Containerization

Now let's containerize our application. Ask AI to help you create a Dockerfile for the application. Put BOTH backend and frontend in 1 container.

What's the BASE IMAGE you used for your Dockerfile?
```
enter here later
```

## Question 7: Deployment

Now let's deploy it. Choose a service to deploy your application.

Which SERVICE did you use for deployment?
```
enter here later
```

