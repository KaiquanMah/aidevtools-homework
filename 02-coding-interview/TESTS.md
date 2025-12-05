# Testing Instructions

## Backend Tests

### Integration Tests
Run backend tests with:
```bash
docker-compose -f docker-compose.dev.yml exec dev python3 -m pytest backend/ -v
```

### Test Coverage (13 tests)

**API Endpoint Tests (4 tests):**
- ✅ Health check endpoint
- ✅ Root endpoint  
- ✅ CORS configuration
- ✅ API endpoints structure

**WebSocket Tests (6 tests):**
- ✅ Event handlers registered (connect, disconnect, join_room, code_change, language_change)
- ✅ Event handlers are callable
- ✅ Basic WebSocket connection
- ✅ Room joining
- ⏭️ Code sync between clients (requires running server)
- ⏭️ Language sync between clients (requires running server)

**App Structure Tests (3 tests):**
- ✅ FastAPI app structure
- ✅ Middleware configuration
- ✅ Basic pytest functionality

### Running Specific Tests
```bash
# Run specific test file
docker-compose -f docker-compose.dev.yml exec dev python3 -m pytest backend/tests/test_integration.py -v

# Run WebSocket tests
docker-compose -f docker-compose.dev.yml exec dev python3 -m pytest backend/tests/test_websocket.py -v
```

## Frontend Tests

**Framework:** Vitest + React Testing Library

**Run tests:**
```bash
docker-compose -f docker-compose.dev.yml exec dev sh -c "cd frontend && npm test"
```

**Test Coverage (8 tests):**

### RoomCreate Component (3 tests)
- ✅ Renders "Create New Room" button
- ✅ Renders room ID input field
- ✅ Renders "Join Room" button

### OutputPanel Component (5 tests)
- ✅ Renders output panel header
- ✅ Displays placeholder when no output
- ✅ Displays output when provided
- ✅ Shows clear button when output exists
- ✅ Hides clear button when no output

## Manual Testing

Since automated frontend tests aren't configured, test the application manually:

### WebSocket Real-time Sync
1. Open two browser windows to `http://localhost:3000`
2. Create a room in one window
3. Join the same room in the second window  
4. Type code in one editor → verify it updates in the other
5. Change language → verify it syncs

### Code Execution
1. Open a room
2. Write JavaScript code with `console.log()`
3. Click "Run" → verify output appears
4. Switch to Python
5. Write Python code with `print()`
6. Click "Run" → verify Pyodide executes and shows output


### Troubleshoot why tests fail
1. Check if the Server is Responding (curl)
```bash
docker-compose -f docker-compose.dev.yml exec dev curl -v http://localhost:8000/api/health
```
Why:
* The error was ConnectionError: Cannot connect to host localhost:8000. This means the test couldn't reach the server.
* **If curl works: The server is up**, and the issue might be in the test code **(e.g., wrong URL, timeout too short)**.
* **If curl fails**: The server is down or not listening on that port. Result: It failed (Failed to connect), confirming the **server was unreachable**.


2. Check Running Processes (ps aux)
```bash
docker-compose -f docker-compose.dev.yml exec dev ps aux
```
Why:
* Since curl failed, I needed to know why. Is the process crashing? Is it not running at all?
* Look for: python or uvicorn processes. Result: I saw only /bin/sh and esbuild (frontend). There was **no python process running the backend.**

3. Restart the Service
```bash
docker-compose -f docker-compose.dev.yml exec -d dev sh -c "cd /app && python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"
```
Why:
* **Since the process was missing, I had to start it manually**.
* Note: In a normal docker-compose up scenario, this should start automatically. If it keeps dying, you'd check logs (docker-compose logs dev).

4. Verify Fix
```bash
docker-compose -f docker-compose.dev.yml exec dev curl -v http://localhost:8000/api/health
```
Why:
* Why: Before running the tests again, I wanted to be 100% sure the server was back up. Result: It returned {"status": "healthy"}.


Summary Checklist for Future
* Is it healthy? (curl health endpoint)
* Is it running? (ps aux)
* Is it reachable? (curl localhost:PORT)
* What do the logs say? (docker-compose logs)

Does this mean i need to restart the svc every time i start the container in docker desktop????
* No, you shouldn't have to restart it manually every time, but currently, your Docker container is configured to start "empty" (idle), and then we use a script to start the actual apps inside it.
* Why this is happening:
    * docker-compose.dev.yml: It has tty: true but no command:. This means when you click "Start" in Docker Desktop, the container just wakes up and waits. It doesn't automatically run your app.
    * start-dev.sh: This script does two things:
        * Starts the container (docker-compose up -d)
        * Manually runs the start commands (exec dev uvicorn... and exec dev npm run dev)
* The Fix
    * If you want the app to start automatically whenever you run the container (e.g., from Docker Desktop), we need to add a command to your docker-compose.dev.yml that runs automatically starts both the backend and frontend when the container starts
    * Created entrypoint.sh: A script that launches both Uvicorn (Backend) and Vite (Frontend).
    * Updated docker-compose.dev.yml: Added command: /bin/bash /app/entrypoint.sh to run this script on startup.
* How to use it now:
    * Docker Desktop: Just click the "Start" (play) button on the container.
    * Terminal: Run `docker-compose -f docker-compose.dev.yml up -d`
    * You no longer need to run start-dev.sh or manually execute commands inside the container!



