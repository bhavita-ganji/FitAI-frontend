import axios from 'axios';

// Resolve the backend API base URL.
// In production (Vercel), VITE_API_URL is set as an Environment Variable in Vercel project settings.
// In local development, it falls back to localhost:8080.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Render free-tier services can have cold starts up to ~20 seconds;
  // 30 seconds ensures we don't time out on first request after idle period.
  timeout: 30000,
  withCredentials: false,
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attach JWT Bearer Token from localStorage on every outgoing request.
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handle global error cases: 401 Unauthorized and network failures.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // HTTP error response received from server
      const { status } = error.response;

      if (status === 401) {
        // Token expired or invalid — clear stale credentials
        // Avoid redirect loops by only clearing outside auth pages
        const isAuthPage = ['/login', '/register'].some((p) =>
          window.location.pathname.startsWith(p)
        );
        if (!isAuthPage) {
          localStorage.removeItem('fitai_token');
          localStorage.removeItem('fitai_user');
          // Let React Router handle the redirect via ProtectedRoute
        }
      }
    } else if (error.request) {
      // Request was made but no response received — likely network or CORS issue
      console.error('[FitAI] Network error - backend may be starting up (Render cold start). Retrying may help.');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

