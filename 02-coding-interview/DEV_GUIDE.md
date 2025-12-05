# Development Guide

## Quick Start

### Using Docker (Recommended)

1. **Start all services:**
   ```bash
   bash start-dev.sh
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Manual Docker Commands

If you prefer to run services manually:

```bash
# Build and start containers
docker-compose -f docker-compose.dev.yml up -d

# Start backend
docker-compose -f docker-compose.dev.yml exec -d dev uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

# Start frontend
docker-compose -f docker-compose.dev.yml exec -d dev sh -c "cd frontend && npm run dev"
```

### npm dev command (Answer to Question 3)

The `npm dev` command in `package.json` is configured as:
```json
"dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
```

However, since Docker is being used for the development environment, the actual command to run both services is in the `start-dev.sh` script.

## Testing

See [TESTS.md](./TESTS.md) for detailed testing instructions.

Quick test commands:
```bash
# Backend tests
docker-compose -f docker-compose.dev.yml exec dev python3 -m pytest backend/

# Run specific test
docker-compose -f docker-compose.dev.yml exec dev python3 -m pytest backend/tests/test_integration.py -v
```

## Architecture

- **Frontend**: React + Vite (Port 3000)
- **Backend**: FastAPI + Socket.IO (Port 8000)
- **Real-time**: WebSocket for live code collaboration
- **Container**: Single development container with Node.js + Python

* Architecture Consideration
  * We do not have any database? YES, no database
    * Data Storage: In-Memory Python Dictionaries
      * Instead of a database, we use in-memory data structures:
        ```python
        # Store room state: room_id -> list of {sid, name}
        rooms = {}

        # Store user state: sid -> room_id
        sid_to_room = {}
        ```
        Example of what's stored:
        ```python
        rooms = {
            'room123': [
                {'sid': 'abc123', 'name': 'Happy Panda'},
                {'sid': 'def456', 'name': 'Cool Tiger'}
            ]
        }

        sid_to_room = {
            'abc123': 'room123',
            'def456': 'room123'
        }
        ```
  * How does FastAPI work?
    * **FastAPI provides the HTTP server (for REST endpoints like /api/health)**
    * **Socket.IO handles WebSocket connections** (for real-time features)
    * **Data lives in RAM (Python dictionaries)** while the server is running
    * When a user joins a room:
      ```python
        @sio.event
        async def join_room(sid, data):
            room_id = data.get('roomId')
            name = generate_random_name()
            
            # Store in memory
            rooms[room_id].append({'sid': sid, 'name': name})
            sid_to_room[sid] = room_id
      ```
    * When a user leaves a room:
      ```python
        @sio.event
        async def disconnect(sid):
            # Remove from memory
            rooms[room_id] = [u for u in rooms[room_id] if u['sid'] != sid]
            del sid_to_room[sid]
      ```
  * Why This Works for a Coding Interview App:
    * Temporary sessions: Interview rooms are temporary anyway
    * Simple: No database setup/maintenance needed
    * Fast: In-memory access is extremely fast
    * Prototype-friendly: Perfect for demos and learning
  * If We Wanted Persistence, We'd Add:
    * Redis - For session storage
    * PostgreSQL/MongoDB - For user accounts, interview history
    * SQLAlchemy - FastAPI's ORM for database operations
  * But for this project, in-memory storage is sufficient because:
    * Rooms are temporary
    * No need to save interview history
    * Simpler deployment (no database to manage)





## Development Workflow

1. Make code changes (hot-reload enabled for both frontend and backend)
2. Test your changes
3. Commit and push

## Stopping Services

```bash
docker-compose -f docker-compose.dev.yml down
```

## UI Fixes
Before going to phase 7, are the UI fixes automatically reused for both containers?

* Yes, absolutely!
* The UI fixes are in the source code (CSS files), so they apply to both environments, but in slightly different ways:

1. Development Container (.dev):
   * Automatic: Because we use "volumes" (syncing your folder to the container), the dev container sees the changes instantly. You don't need to do anything; if you open localhost:3000, the fixes are already there.

2. Production Container (.prod):
   * Baked In: This container copies the files when you build it. Since I ran docker-compose build after making the changes, the fixes are now baked into that image too.

* So yes, both are fixed! The source of truth is your code, and both containers use that same code.


## Local Containers
* Separate Dev and PROD container environments
* both environments can run simultaneously
* Development Environment:
  * URL: http://localhost:3000
  * Features: Hot-reloading, full logs, uses local files.
  * Status: Running (Port 3000 & 8000)
* Production Environment:
  * URL: http://localhost:8080
  * Features: Optimized build, Nginx server, immutable.
  * Status: Running (Port 8080)



## Free deployment options
Focusing on WebSocket support (critical for our app) and Docker compatibility.

🏆 Top Recommendation: Koyeb
* Why: It is currently the best option for hobbyist WebSocket apps.
* Free Tier: "Hobby" plan with 512MB RAM, 0.1 vCPU (enough for us).
* WebSockets: Fully supported with no timeouts (unlike Render).
* Deployment: Supports Dockerfile deployment directly from GitHub.
* Location: Global edge network.

Alternatives (and why they are not recommended):
* Render: Popular, BUT has a 5-minute timeout on WebSocket connections in the free tier. This would break our interview sessions.
* Fly.io: Recently removed their free tier for new users (now Pay-As-You-Go).
* Railway: Only offers a trial ($5 credit), not a permanent free tier.

Can we host on GitHub?
* Short answer: No, not for this application.
* GitHub Pages: Only hosts static files (HTML, CSS, JS). It cannot run a Python backend or Docker containers. It would only work if we had only a frontend.
* GitHub Container Registry: Can store your Docker images (like a warehouse), but it doesn't run them (like a server). You still need a computer to pull the image and run it.
* GitHub Codespaces: This is a development environment (like what we are using now), not a production server for public users.

Why we need a Cloud Platform (like Koyeb)
*Our app has a Python Backend that needs to be "alive" and listening for WebSocket connections 24/7. GitHub doesn't offer a service to run backend servers for free hosting.
* Koyeb (or Render/Railway) basically gives you a computer in the cloud that runs your Docker container 24/7 so users can connect to it.



## Koyeb deployment
* Created Dockerfile: I copied Dockerfile.prod to Dockerfile so Koyeb will automatically detect it.
* Created Deployment Guide: A step-by-step guide (DEPLOY.md) is available in your artifacts.

🛠️ Koyeb Builder Configuration
* Dockerfile Location: Dockerfile (This is important!)
  * The location of your Dockerfile relative to the work directory. If not set, the work directory defaults to the root of the repository
* Entrypoint: Leave Empty (Our Dockerfile handles this)
* Command: Leave Empty (Our Dockerfile handles this)
* Target: Leave Empty
* Work Directory: 02-coding-interview
  * The directory where your source code is located. If not set, the work directory defaults to the root of the repository.
* Crucial Reminder: In the Ports section (usually the next step or under "Advanced"), make sure to change the port from 8000 to 80.


Ports and Protocol (TCP, HTTP)
* **Port 80 (CRITICAL)**: This is the **only port your container listens on publicly**. It runs Nginx, which serves the frontend AND proxies API calls to the backend.
   * Koyeb Setting: You MUST set the port to 80 in Koyeb.
* **Port 3000**: This was only used to **build the frontend. It doesn't exist in the final running container.**
   * Koyeb Setting: Ignore.
* **Port 8000**: This is the **internal backend port (Python)**. Nginx talks to it inside the container. **The outside world cannot see it directly.**
   * Koyeb Setting: Ignore.
* **Port 8080**: This was just for your **local PROD testing (mapping your computer's 8080 to the container's 80).** In the cloud, you get a nice URL (e.g., https://myapp.koyeb.app) which maps to port 80 automatically.
   * Koyeb Setting: Ignore.
* Summary for Koyeb Config:
   * Port: 80
   * Protocol: HTTP
   * Public Path: /
* For health checks, we use port 80 TCP????
  * port 80 is correct
  * protocol HTTP is better than TCP
    * TCP: Just checks if "the door is open" **(connection accepted)**.
    * HTTP: Checks if "someone answers the door" **(server responds with 200 OK)**.
  * path:
    * Recommended: '/' hits ur frontend (Nginx serving index.html). If Nginx is up, it returns 200 OK.
    * Alternative: /api/health (This hits the Python backend). Using / is safer because it confirms the web server is reachable.
  * Method: GET
    * Standard for health checks.
  * Headers: None needed.
    * Leave empty.
  * Grace period: 5 seconds
    * The **initial period** to wait for the instance to become healthy
  * Interval: 30 seconds
    * The **period between two checks**
  * Timeout: 5 seconds
    * The **maximum time to wait before considering the check as a failure**
  * Restart limit: 3
    * The **number of consecutive failures before** attempting to **restart the instance**


## Test Webpage and Troubleshoot Deployment
* 'Javascript' session - open 2 tabs in Chrome OR Edge
  * Update code, click on run, output is shown
  * 2 users are shown
  * Code updates from 1 user's tab is synced to another user's tab
* 'Python' session - open 2 tabs in Chrome
  * Either dont update code or update code, click on run - Chrome browser tab runs successfully
  * 2 users are shown
  * Code updates from 1 user's tab is synced to another user's tab
* **'Python' session - open 2 tabs in Edge**
  * **Either dont update code or update code, click on run - Edge browser tab crashes IMMEDIATELY OR AFTER 15 SECONDS (with the running button still spinning)**
  * Why 'python run' leads to a crash in the Edge browser tab?
    * Since the code works in Chrome, the code (Web Worker, Headers, Pyodide) is correct. The crash in Edge is might be due to "Enhanced Security Mode".
      * What it does: It disables JIT (Just-In-Time) compilation for security.
      * Why it breaks Pyodide: WebAssembly (WASM) and Python rely heavily on JIT for performance. Without it, the engine struggles, hangs, and eventually the tab crashes (STATUS_ACCESS_VIOLATION).
      * However our app requirement is to use WASM to run code in the client and not on the server, so we need to accept this limitation for our current prototype, and use/cater for only Chrome browser for now.


## Code to backup docker images to Docker Hub
Tag the development image as 'dev'
* This docker image was built from Dockerfile.dev
```
docker tag 02-coding-interview-dev:latest kaiquanmah0/aidevtools-w2-codinginterview:dev
```

Tag the production image as 'latest' or 'prod'
* This docker image was built from Dockerfile.prod
* 'Dockerfile' is identical to 'Dockerfile.prod'
```
docker tag 02-coding-interview-app:latest kaiquanmah0/aidevtools-w2-codinginterview:prod
```



