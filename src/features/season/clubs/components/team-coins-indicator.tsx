import { CoinsIcon } from 'lucide-react';
import { Badge, Skeleton } from '@/components/ui';
import { formatNumber } from '@/lib';
import { useUserStore } from '@/stores';
import { useClub } from '../hooks';

export const TeamCoinsIndicator = () => {
  const { user } = useUserStore();
  const { data, isPending } = useClub(user?.teamId ?? undefined);

  if (!user?.teamId) return null;

  if (isPending) return <Skeleton className={'h-5 w-16 rounded-4xl'} />;

  if (data?.coins === null || data?.coins === undefined) return null;

  return (
    <Badge variant={'outline'} className={'gap-1.5'}>
      <CoinsIcon className={'size-3.5 text-value'} />
      <span className={'font-semibold tabular-nums'}>
        {formatNumber(data.coins)}
      </span>
    </Badge>
  );
};
