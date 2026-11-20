import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listNotifications } from '../api';
import type { ListNotificationsQuery } from '../types';

export const useNotifications = (query: ListNotificationsQuery) => {
  return useQuery({
    queryKey: queryKeys.notifications.list(query),
    queryFn: () => listNotifications(query),
    refetchInterval: 30_000,
  });
};
