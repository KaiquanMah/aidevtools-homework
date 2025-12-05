#!/bin/bash

# Start Docker containers (which now auto-starts services via entrypoint.sh)
echo "Starting Docker containers..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for containers to be ready
sleep 2

echo ""
echo "================================"
echo "Services started successfully!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo "================================"
