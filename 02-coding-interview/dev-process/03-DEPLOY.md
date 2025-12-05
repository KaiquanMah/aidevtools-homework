# Deployment Guide: Koyeb

This guide explains how to deploy the Coding Interview Application to **Koyeb** for free.

## Prerequisites
1.  **GitHub Account**: You need a GitHub account with this repository pushed to it.
2.  **Koyeb Account**: Sign up at [koyeb.com](https://www.koyeb.com/).

## Steps to Deploy

### 1. Connect GitHub to Koyeb
1.  Log in to your Koyeb dashboard.
2.  Click **Create App** (or "Create Service").
3.  Select **GitHub** as the deployment method.
4.  Install the Koyeb GitHub App if prompted, and select your repository (`aidevtools-homework` or similar).

### 2. Configure the Service
Koyeb will detect the `Dockerfile` in the root of your repository (which is our production build).

*   **Builder**: Dockerfile
*   **Privileged**: No (default)
*   **Service Name**: Choose a name (e.g., `coding-interview`).
*   **Regions**: Choose the one closest to you (e.g., Washington, D.C., Frankfurt, Singapore).
*   **Instance Type**: **Free** (Nano) - 512MB RAM, 0.1 vCPU.

### 3. Environment Variables (Optional)
We don't strictly need any environment variables for the basic app to work, but if you want to secure it later, you can add them here. For now, leave empty.

### 4. Port Configuration
**IMPORTANT:** The application listens on **Port 80** (via Nginx).
1.  Look for the **Ports** section (usually under "Advanced" or "Expose").
2.  Ensure the port is set to **80**.
    *   **Port**: `80`
    *   **Protocol**: `HTTP`
    *   **Public Path**: `/`

### 5. Deploy
1.  Click **Deploy**.
2.  Wait for the build to complete. It will:
    *   Build the frontend (React/Vite).
    *   Build the backend (Python/FastAPI).
    *   Start the Nginx server.

### 6. Access the App
Once the status is **Healthy**, click the **Public URL** (e.g., `https://coding-interview-yourname.koyeb.app`).

## Troubleshooting
*   **WebSocket Errors**: If you see connection errors, ensure your browser allows WebSocket connections (standard browsers do). Koyeb supports WebSockets natively.
*   **Build Failure**: Check the "Build Logs". If it fails on `npm install`, it might be a temporary network issue. Retry the deployment.
