import axios from 'axios';
import { useAuthStore } from '@/stores';

export const api = axios.create({
  baseURL: import.meta.env.PUBLIC_BACKEND_ENDPOINT ?? 'http://localhost:3333',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
