import {
  NegotiationList,
  useNegotiations,
} from '@/features/season/negotiations';

type ReceivedNegotiationListProps = {
  myTeamId?: string;
};

export const ReceivedNegotiationList = ({
  myTeamId,
}: ReceivedNegotiationListProps) => {
  const {
    data: received,
    isPending,
    isError,
    error,
  } = useNegotiations({ direction: 'received' });

  return (
    <NegotiationList
      negotiations={received ?? []}
      myTeamId={myTeamId}
      isPending={isPending}
      isError={isError}
      error={error}
      emptyMessage={'Nenhuma proposta recebida ainda.'}
    />
  );
};
