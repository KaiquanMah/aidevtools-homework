import axios from 'axios';

const getBaseURL = () => {
    // 1. Explicit environment variable override (highest priority)
    const envURL = process.env.NEXT_PUBLIC_API_URL;
    if (envURL) return envURL;

    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;

        // 2. Strict check for internal Docker hostnames used in E2E/Dev
        // This prevents matching 'something-frontend.onrender.com' in production
        if (hostname === 'frontend' || hostname === 'finnish-frontend' || hostname === 'e2e-runner') {
            // Use the internal backend service name known to Docker
            return 'http://backend:8000';
        }

        // 3. Local development (outside Docker)
        if (hostname === 'localhost') {
            return 'http://localhost:8000';
        }
    }

    // 4. Production (Render)
    // Use relative paths since frontend and backend share the same origin
    // This avoids "Local Network" permission popups.
    return '';
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to inject Token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log(`API Interceptor: URL=${config.url}, Token exists=${!!token}`);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
