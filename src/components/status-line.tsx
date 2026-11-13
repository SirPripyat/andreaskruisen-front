import { CheckIcon, CircleAlertIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import { cn } from '@/lib';

type StatusLineTone = 'ok' | 'warn';

type StatusLineProps = {
  tone: StatusLineTone;
  text: string;
  className?: string;
};

const STATUS_LINE_TEXT_STYLES: Record<StatusLineTone, string> = {
  ok: 'text-success',
  warn: 'text-muted-foreground',
};

const STATUS_LINE_ICONS: Record<
  StatusLineTone,
  ComponentType<{ className?: string }>
> = {
  ok: CheckIcon,
  warn: CircleAlertIcon,
};

export const StatusLine = ({ tone, text, className }: StatusLineProps) => {
  const Icon = STATUS_LINE_ICONS[tone];

  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-1.5 text-xs',
        STATUS_LINE_TEXT_STYLES[tone],
        className,
      )}
    >
      <Icon className={'size-3.5 shrink-0'} />
      <span className={'truncate'}>{text}</span>
    </div>
  );
};
