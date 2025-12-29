# Stage 1: Build Frontend
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend

# Copy frontend dependency files
COPY src/frontend/package.json src/frontend/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY src/frontend ./

# Build static site (output to /app/frontend/out)
RUN npm run build


# Stage 2: Setup Backend
FROM python:3.11-slim as backend

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY src/backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY src/backend /app

# Copy content for seeding
COPY src/database/content /app/src/database/content

# Copy vocabulary for speaking practice
COPY src/database/vocabulary /app/src/database/vocabulary

# Copy built frontend from Stage 1 to backend static folder
# We need to ensure the static directory exists or is created by COPY
# FastAPI (in main.py) should be configured to serve from "static"
COPY --from=frontend-builder /app/frontend/out /app/static

# Expose port
EXPOSE 8000

# Command to run the application
# We need to run init_db first, then start the server
# CMD ["sh", "-c", "python init_db.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
# to be more robust
# "Look for an environment variable named PORT.
#   If it exists, use it.
#  If it's missing or empty (which is true for your local dev environment), use 8000 as the fallback default ':-'
CMD ["sh", "-c", "python init_db.py && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
