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

## Development Workflow

1. Make code changes (hot-reload enabled for both frontend and backend)
2. Test your changes
3. Commit and push

## Stopping Services

```bash
docker-compose -f docker-compose.dev.yml down
```
