import { PageHeader } from '@/components';
import { useSelectedSeason } from '@/features/admin/seasons';
import {
  NegotiationWindowHistoryTable,
  NegotiationWindowStatusCard,
} from './components';
import { useNegotiationWindowStatus } from './hooks';

export const NegotiationWindowScreen = () => {
  const { selectedSeason } = useSelectedSeason();
  const { data, isPending, isError, error } = useNegotiationWindowStatus();

  return (
    <div className={'flex flex-col gap-6'}>
      <PageHeader
        title={'Janela de negociação'}
        description={`Controla quando transferências e negociações diretas são permitidas na temporada "${selectedSeason?.name}", e se a taxa de negociação vale nessa janela.`}
      />

      {!isPending && !isError && (
        <NegotiationWindowStatusCard open={data?.open ?? null} />
      )}

      <div className={'flex flex-col gap-2'}>
        <h2 className={'font-medium text-sm text-muted-foreground'}>
          {'Histórico'}
        </h2>
        <NegotiationWindowHistoryTable
          history={data?.history ?? []}
          isPending={isPending}
          isError={isError}
          error={error}
        />
      </div>
    </div>
  );
};
