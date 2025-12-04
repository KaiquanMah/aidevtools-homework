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
