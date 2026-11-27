import { BellIcon } from 'lucide-react';
import {
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
    <Sheet>
      <SheetTrigger
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
      </SheetTrigger>
      <SheetContent side={'bottom'} className={'h-[80%]'}>
        <SheetHeader
          className={'flex-row items-center justify-between gap-2 pr-10'}
        >
          <SheetTitle>Notificações</SheetTitle>
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
        </SheetHeader>
        {notifications.length === 0 && (
          <p className={'px-4 py-4 text-center text-sm text-muted-foreground'}>
            Nenhuma notificação por aqui.
          </p>
        )}
        <div
          className={
            'flex flex-col gap-1 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]'
          }
        >
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
