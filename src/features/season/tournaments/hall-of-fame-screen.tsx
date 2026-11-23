import { useState } from 'react';
import { PageHeader } from '@/components';
import { Skeleton, Tabs, TabsList, TabsTab } from '@/components/ui';
import { useSelectedSeason } from '@/features/admin/seasons';
import { getErrorMessage } from '@/lib';
import { GoalLeadersList, TournamentFormatIcon } from './components';
import { useHallOfFame } from './hooks';
import {
  TOURNAMENT_FORMAT_LABELS,
  TOURNAMENT_FORMATS,
  type TournamentFormat,
} from './types';

type Metric = 'scorers' | 'assists';

const METRIC_LABELS: Record<Metric, string> = {
  scorers: 'Artilheiros',
  assists: 'Assistências',
};

// "Fase de grupos + mata-mata" (o label canônico, usado em badges) não
// cabe ao lado das outras abas no mobile — versão curta só pra aba.
const FORMAT_TAB_LABELS: Record<TournamentFormat, string> = {
  ...TOURNAMENT_FORMAT_LABELS,
  GROUP_STAGE_KNOCKOUT: 'Grupos + mata-mata',
};

const COUNT_LABELS: Record<Metric, string> = {
  scorers: 'gols',
  assists: 'assistências',
};

export const HallOfFameScreen = () => {
  const { selectedSeason } = useSelectedSeason();
  const [format, setFormat] = useState<TournamentFormat>(TOURNAMENT_FORMATS[0]);
  const [metric, setMetric] = useState<Metric>('scorers');

  const { data, isPending, isError, error } = useHallOfFame(format);

  const leaders = metric === 'scorers' ? data?.topScorers : data?.topAssists;

  return (
    <>
      <PageHeader
        title={'Hall da Fama'}
        description={`Os 20 maiores nomes da temporada "${selectedSeason?.name}", por tipo de campeonato.`}
      />

      <div
        className={
          'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'
        }
      >
        <Tabs
          value={format}
          onValueChange={(value) => setFormat(value as TournamentFormat)}
        >
          <TabsList>
            {TOURNAMENT_FORMATS.map((item) => (
              <TabsTab key={item} value={item} style={{ flex: 'none' }}>
                <TournamentFormatIcon format={item} className={'size-3.5'} />
                {FORMAT_TAB_LABELS[item]}
              </TabsTab>
            ))}
          </TabsList>
        </Tabs>

        <Tabs
          value={metric}
          onValueChange={(value) => setMetric(value as Metric)}
        >
          <TabsList>
            {(['scorers', 'assists'] as const).map((item) => (
              <TabsTab key={item} value={item}>
                {METRIC_LABELS[item]}
              </TabsTab>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {isPending && (
        <div className={'flex flex-col gap-4'}>
          <Skeleton className={'h-40 w-full'} />
          <Skeleton className={'h-64 w-full'} />
        </div>
      )}

      {!isPending && isError && (
        <p className={'text-center text-destructive text-sm'}>
          {getErrorMessage(error, 'Não foi possível carregar o hall da fama.')}
        </p>
      )}

      {!isPending && !isError && leaders?.length === 0 && (
        <p className={'text-center text-muted-foreground text-sm'}>
          {metric === 'scorers'
            ? 'Nenhum gol registrado ainda para esse campeonato.'
            : 'Nenhuma assistência registrada ainda para esse campeonato.'}
        </p>
      )}

      {!isPending && !isError && leaders && leaders.length > 0 && (
        <GoalLeadersList leaders={leaders} countLabel={COUNT_LABELS[metric]} />
      )}
    </>
  );
};
