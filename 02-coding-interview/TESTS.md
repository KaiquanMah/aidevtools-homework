# Testing Instructions

## Backend Tests

### Integration Tests
Run the following command to execute backend integration tests:
```bash
python3 -m pytest backend/
```
Or with Docker:
```bash
docker-compose -f docker-compose.dev.yml exec dev python3 -m pytest backend/
```

**Current Test Coverage:**
- ✅ REST API endpoints (`/`, `/api/health`)
- ⚠️ WebSocket integration tests (to be added)

### Running Specific Tests
```bash
# Run with verbose output
docker-compose -f docker-compose.dev.yml exec dev python3 -m pytest backend/ -v

# Run specific test file
docker-compose -f docker-compose.dev.yml exec dev python3 -m pytest backend/tests/test_integration.py -v
```

## Frontend Tests
```bash
cd frontend && npm test
```
Or with Docker:
```bash
docker-compose -f docker-compose.dev.yml exec dev sh -c "cd frontend && npm test"
```

**Current Status:** Frontend tests are not yet configured. This will be added in a future phase. Currently returns a placeholder message.

## Integration Testing Notes

The backend integration tests use FastAPI's `TestClient` to test REST API endpoints. For true end-to-end WebSocket testing, you can:

1. **Manual Testing**: Open two browsers to `http://localhost:3000`, create a room, and verify real-time code sync
2. **Automated WebSocket Tests** (Future): Will require a Socket.IO test client
