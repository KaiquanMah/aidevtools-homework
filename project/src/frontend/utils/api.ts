import axios from 'axios';

const getBaseURL = () => {
    // If NEXT_PUBLIC_API_URL is set (e.g. in local dev), use it.
    // Otherwise, default to empty string for same-origin relative requests.
    // This fixed the "Local Network" permission popup on mobile/modern browsers
    // by avoiding internal Docker hostnames like 'finnish-backend'.
    const envURL = process.env.NEXT_PUBLIC_API_URL;

    if (envURL) {
        console.log('API Client: using configured API URL:', envURL);
        return envURL;
    }

    // In production (Render), frontend and backend are on the same host.
    // In local dev without the env var, fallback to localhost:8000
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:8000';
    }

    return ''; // Relative to same origin
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
