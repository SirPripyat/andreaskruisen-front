import { cn } from 'cn';
import { CheckIcon, ClockIcon, XIcon } from 'lucide-react';
import type { NegotiationStatus } from '../types';
import { STATUS_LABELS } from '../utils/negotiation-labels';

const STATUS_CLASS_NAME: Record<NegotiationStatus, string> = {
  PENDING: 'bg-warning-surface text-warning',
  ACCEPTED: 'bg-success-surface text-success',
  REJECTED: 'bg-critical-surface text-critical',
};

const STATUS_ICON: Record<NegotiationStatus, typeof ClockIcon> = {
  PENDING: ClockIcon,
  ACCEPTED: CheckIcon,
  REJECTED: XIcon,
};

export const NegotiationStatusBadge = ({
  status,
}: {
  status: NegotiationStatus;
}) => {
  const Icon = STATUS_ICON[status];

  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 font-semibold text-xs',
        STATUS_CLASS_NAME[status],
      )}
    >
      <Icon className={'size-3'} />
      {STATUS_LABELS[status]}
    </span>
  );
};
