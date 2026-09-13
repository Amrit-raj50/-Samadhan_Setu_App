/**
 * Samadhan Setu — API Service
 * Axios instance configured for Report_Maro / Samadhan_Setu Express backend.
 */
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://report-maro-1.onrender.com/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = (): string | null => {
  return authToken;
};

// Request interceptor — attach JWT Bearer token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — graceful error handling for unauthenticated / expired requests
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 401 Unauthorized — user is not logged in or JWT token expired
      console.log('[API] Unauthenticated (401) — backend requires JWT login token.');
    }
    return Promise.reject(error);
  }
);

export default api;
