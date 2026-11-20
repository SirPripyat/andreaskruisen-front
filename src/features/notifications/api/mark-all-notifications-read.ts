import { api } from '@/lib';

export const markAllNotificationsRead = () =>
  api
    .patch<{ count: number }>('/notifications/read-all')
    .then((res) => res.data);
