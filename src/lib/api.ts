import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.PUBLIC_BACKEND_ENDPOINT ?? 'http://localhost:3333',
  withCredentials: true,
});
