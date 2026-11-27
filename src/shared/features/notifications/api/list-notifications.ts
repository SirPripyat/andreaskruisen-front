import { api, type PaginatedResult, serializeQueryParams } from '@/lib';
import type { ListNotificationsQuery, Notification } from '../types';

export const listNotifications = (query: ListNotificationsQuery) =>
  api
    .get<PaginatedResult<Notification>>('/notifications', {
      params: serializeQueryParams(query),
    })
    .then((res) => res.data);
