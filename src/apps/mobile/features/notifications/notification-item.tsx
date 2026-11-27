import { cn, formatDateTime } from '@/lib';
import {
  type Notification,
  NotificationIcon,
  useMarkNotificationRead,
} from '@/shared/features/notifications';

type NotificationItemProps = {
  notification: Notification;
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { mutate: markAsRead } = useMarkNotificationRead();

  const isUnread = !notification.readAt;

  const handleClick = () => {
    if (isUnread) markAsRead(notification.id);
  };

  return (
    <button
      type={'button'}
      className={
        'flex items-start gap-2 rounded-md px-1.5 py-2.5 text-left active:bg-accent'
      }
      onClick={handleClick}
    >
      <NotificationIcon type={notification.type} />
      <div className={'flex min-w-0 flex-1 flex-col gap-0.5'}>
        <div className={'flex items-center gap-2'}>
          <span
            className={cn(
              'truncate text-sm',
              isUnread ? 'font-medium' : 'text-muted-foreground',
            )}
          >
            {notification.title}
          </span>
          {isUnread && (
            <span
              className={'size-1.5 shrink-0 rounded-full bg-primary'}
              aria-hidden={'true'}
            />
          )}
        </div>
        <span className={'line-clamp-2 text-xs text-muted-foreground'}>
          {notification.message}
        </span>
        <span className={'text-xs text-muted-foreground'}>
          {formatDateTime(notification.createdAt)}
        </span>
      </div>
    </button>
  );
};
