import {
  NegotiationList,
  useNegotiations,
} from '@/features/season/negotiations';

type SentNegotationListProps = {
  myTeamId?: string;
};

export const SentNegotationList = ({ myTeamId }: SentNegotationListProps) => {
  const {
    data: sent,
    isPending,
    isError,
    error,
  } = useNegotiations({ direction: 'sent' });

  return (
    <NegotiationList
      negotiations={sent ?? []}
      myTeamId={myTeamId}
      isPending={isPending}
      isError={isError}
      error={error}
      emptyMessage={'Nenhuma proposta enviada ainda.'}
    />
  );
};
