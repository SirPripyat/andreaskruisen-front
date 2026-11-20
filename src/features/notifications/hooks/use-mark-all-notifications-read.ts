import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { markAllNotificationsRead } from '../api';

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    meta: {
      errorMessage: 'Não foi possível marcar as notificações como lidas.',
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};
