import { api } from '@/lib';
import type { Notification } from '../types';

export const markNotificationRead = (id: string) =>
  api.patch<Notification>(`/notifications/${id}/read`).then((res) => res.data);
