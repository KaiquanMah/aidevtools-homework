import axios from 'axios';

const getBaseURL = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        console.log('API Client: detected hostname:', hostname);
        // In local Docker network, hostname might be 'frontend', 'finnish-frontend', or even an IP
        if (hostname.includes('frontend') || hostname === 'e2e-runner') {
            const dockerURL = 'http://finnish-backend:8000';
            console.log('API Client: using Docker internal URL:', dockerURL);
            return dockerURL;
        }
    }
    const envURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log('API Client: falling back to URL:', envURL);
    return envURL;
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
