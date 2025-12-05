# Implementation Plan - Phase 1 & 2

## Goal Description
Complete the basic setup of the End-to-End Coding Interview Application (Phase 1) and establish a testing framework (Phase 2).
Currently, the project has the basic file structure but lacks functional WebSocket communication and API endpoints.

## User Review Required
> [!IMPORTANT]
> **Docker-First Approach**: As requested, all package installations and runtime execution will happen inside the Docker container defined in `Dockerfile.dev`.
>
> **Windsurf Code Assessment**: The existing code provides a valid skeleton:
> - **Frontend**: React+Vite structure is correct. Routing is set up.
> - **Backend**: FastAPI app is initialized correctly with CORS.
> - **Docker**: The mono-container approach (Node+Python in one) is efficient for this development phase.
>
> **Plan Update**: I will first ensure the Docker environment is running and dependencies are installed therein before writing the logic.

## Proposed Changes

### Environment Setup (Docker)
#### [MODIFY] [Dockerfile.dev](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/02-coding-interview/Dockerfile.dev)
- Update to use `backend/requirements.txt` for Python dependencies to ensure consistency.

#### [EXECUTE] Docker Build & Install
- Build container: `docker-compose -f docker-compose.dev.yml build`
- Start container: `docker-compose -f docker-compose.dev.yml up -d`
- Install Frontend Deps: `docker-compose -f docker-compose.dev.yml exec dev sh -c "cd frontend && npm install"`

### Backend Implementation
#### [MODIFY] [backend/main.py](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/02-coding-interview/backend/main.py)
- Mount `socketio` server.
- Add basic API endpoints for room creation/checking.

#### [NEW] [app/api/websocket.py](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/02-coding-interview/backend/app/api/websocket.py)
- Handle WebSocket events (`connect`, `disconnect`, `code_change`, `join_room`).

### Frontend
#### [MODIFY] [src/components/RoomCreate.jsx](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/02-coding-interview/frontend/src/components/RoomCreate.jsx)
- Implement form submission to create a room (call backend API).
- Navigate to `/room/:roomId`.

#### [MODIFY] [src/components/Room.jsx](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/02-coding-interview/frontend/src/components/Room.jsx)
- Initialize WebSocket connection.
- Handle joining the room.

#### [MODIFY] [src/components/CodeEditor.jsx](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/02-coding-interview/frontend/src/components/CodeEditor.jsx)
- Emit `code_change` events on user input.
- Listen for `code_update` events to update local state.

### Testing (Phase 2)
#### [NEW] [backend/tests/test_integration.py](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/02-coding-interview/backend/tests/test_integration.py)
- Integration tests for WebSocket connection and API.

#### [NEW] [TESTS.md](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/02-coding-interview/TESTS.md)
- Document testing commands.

## Verification Plan

### Automated Tests
- Run backend tests: `pytest backend/`
- Run frontend tests: `npm test` (once setup)

### Manual Verification
1. Start backend: `uvicorn backend.main:app --reload`
2. Start frontend: `npm run dev`
3. Open two browser windows.
4. Create a room in one window.
5. Join the same room in the second window.
6. Type code in one editor and verify it updates in the other.
