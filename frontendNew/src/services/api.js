import axios from 'axios';
import { MOCK_MODE } from '../utils/constants';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the auth token (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('sahayak_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error shape so calling code can rely on `error.message`.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

/**
 * Whether the app should use mock data instead of the real FastAPI backend.
 * True whenever VITE_API_BASE_URL has not been configured, so the frontend
 * always remains demonstrable without a backend.
 */
export const isMockMode = MOCK_MODE;

/** Small helper so mock services can simulate realistic network latency. */
export function mockDelay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
