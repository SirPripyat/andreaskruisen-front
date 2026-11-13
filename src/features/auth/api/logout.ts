import { api } from '@/lib';

export const logout = () => api.post('/auth/logout');
