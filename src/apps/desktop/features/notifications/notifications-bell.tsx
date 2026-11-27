import { BellIcon } from 'lucide-react';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import {
  useMarkAllNotificationsRead,
  useNotifications,
} from '@/shared/features/notifications';
import { NotificationItem } from './notification-item';

export const NotificationsBell = () => {
  const { data } = useNotifications({ page: 1, pageSize: 20 });
  const { mutate: markAllRead, isPending: isMarkingAllRead } =
    useMarkAllNotificationsRead();

  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter((item) => !item.readAt).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant={'ghost'}
            size={'icon'}
            className={'relative rounded-full'}
          />
        }
      >
        <BellIcon />
        {unreadCount > 0 && (
          <Badge
            variant={'destructive'}
            className={
              'absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]'
            }
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={'w-80'} align={'end'} sideOffset={4}>
        <DropdownMenuGroup
          className={'flex items-center justify-between gap-2 pr-1'}
        >
          <DropdownMenuLabel>Notificações</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant={'link'}
              size={'xs'}
              disabled={isMarkingAllRead}
              onClick={() => markAllRead()}
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {notifications.length === 0 && (
          <p
            className={'px-1.5 py-4 text-center text-sm text-muted-foreground'}
          >
            Nenhuma notificação por aqui.
          </p>
        )}
        <DropdownMenuGroup>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
