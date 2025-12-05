#!/bin/sh

# Start Backend (Uvicorn) in the background
echo "Starting Backend..."
cd /app
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &

# Start Frontend (Vite) in the background
echo "Starting Frontend..."
cd /app/frontend
npm run dev &

# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?
