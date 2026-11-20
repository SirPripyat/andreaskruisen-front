import { ArrowLeftRightIcon, CoinsIcon, TriangleAlertIcon } from 'lucide-react';
import { cn } from '@/lib';
import type { NotificationType } from '../types';

const NOTIFICATION_ICON: Record<NotificationType, typeof ArrowLeftRightIcon> = {
  TRANSFER_COMPLETED: ArrowLeftRightIcon,
  TOURNAMENT_PRIZE_AWARDED: CoinsIcon,
  AUDIT_DISCREPANCY_FOUND: TriangleAlertIcon,
};

const NOTIFICATION_ICON_CLASSNAME: Record<NotificationType, string> = {
  TRANSFER_COMPLETED: 'bg-blue-500/10 text-blue-500',
  TOURNAMENT_PRIZE_AWARDED: 'bg-amber-500/10 text-amber-500',
  AUDIT_DISCREPANCY_FOUND: 'bg-destructive/10 text-destructive',
};

type NotificationIconProps = {
  type: NotificationType;
};

export const NotificationIcon = ({ type }: NotificationIconProps) => {
  const Icon = NOTIFICATION_ICON[type];

  return (
    <div
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full',
        NOTIFICATION_ICON_CLASSNAME[type],
      )}
    >
      <Icon className={'size-4'} />
    </div>
  );
};
