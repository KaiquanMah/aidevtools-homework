# Stage 1: Build Frontend
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend & Final Image
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (if needed) and Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy Backend Code
COPY backend/ ./backend/

# Copy Frontend Build from Stage 1
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Configure Nginx
# Remove default config
RUN rm /etc/nginx/sites-enabled/default
# Create new config
RUN echo 'server { \
    listen 80; \
    location / { \
        root /app/frontend/dist; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
        add_header Cross-Origin-Opener-Policy same-origin; \
        add_header Cross-Origin-Embedder-Policy require-corp; \
    } \
    location /api { \
        proxy_pass http://127.0.0.1:8000; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
    } \
    location /socket.io { \
        proxy_pass http://127.0.0.1:8000; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Create start script
RUN echo '#!/bin/bash \n\
nginx & \n\
gunicorn backend.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 \n\
wait' > /start.sh && chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
