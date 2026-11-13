import { api } from '@/lib';

export const deleteUser = (userId: string) => api.delete(`/users/${userId}`);
