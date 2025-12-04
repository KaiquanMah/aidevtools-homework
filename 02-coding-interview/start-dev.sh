#!/bin/bash

# Start Docker containers
echo "Starting Docker containers..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for containers to be ready
sleep 2

# Start backend server
echo "Starting backend server..."
docker-compose -f docker-compose.dev.yml exec -d dev uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

# Start frontend development server
echo "Starting frontend server..."
docker-compose -f docker-compose.dev.yml exec -d dev sh -c "cd frontend && npm run dev"

echo ""
echo "================================"
echo "Services started successfully!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo "================================"
