import { cn } from '@/lib';

export const TeamAlreadyPicked = () => (
  <span
    className={cn(
      'absolute inset-0 flex items-center justify-center rounded-lg bg-surface/80',
      'text-muted-foreground text-xs font-medium',
    )}
  >
    Já atribuído
  </span>
);
