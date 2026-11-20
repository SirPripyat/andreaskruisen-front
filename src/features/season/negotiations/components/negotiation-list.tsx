import { Skeleton } from '@/components/ui';
import { getErrorMessage } from '@/lib';
import type { Negotiation } from '../types';
import { NegotiationCard } from './negotiation-card';

type NegotiationListProps = {
  negotiations: Negotiation[];
  myTeamId: string | undefined;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  emptyMessage: string;
};

export const NegotiationList = ({
  negotiations,
  myTeamId,
  isPending,
  isError,
  error,
  emptyMessage,
}: NegotiationListProps) => {
  if (isPending) {
    return (
      <div className={'flex flex-col gap-2'}>
        <Skeleton className={'h-28 w-full'} />
        <Skeleton className={'h-28 w-full'} />
      </div>
    );
  }

  if (isError) {
    return (
      <p className={'text-destructive text-sm'}>
        {getErrorMessage(error, 'Não foi possível carregar as negociações.')}
      </p>
    );
  }

  if (negotiations.length === 0) {
    return (
      <p className={'p-6 text-center text-muted-foreground text-sm'}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={'flex flex-col gap-3'}>
      {negotiations.map((negotiation) => (
        <NegotiationCard
          key={negotiation.id}
          negotiation={negotiation}
          myTeamId={myTeamId}
        />
      ))}
    </div>
  );
};
