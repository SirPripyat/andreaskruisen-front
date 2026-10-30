import type { ReactNode } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { Skeleton, Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui';
import { useBreadcrumbItems } from '@/hooks';
import { getErrorMessage } from '@/lib';
import {
  RegisterMatchGoalsDrawer,
  TopAssistsTab,
  TopScorersTab,
  TournamentBracket,
  TournamentDetailDashboard,
  TournamentFixtures,
  TournamentGroupStandings,
} from './components';
import {
  type TournamentDetailTab,
  useAdvancePhase,
  useTournament,
  useTournamentDetailTabs,
} from './hooks';

type TabItem = {
  value: TournamentDetailTab;
  label: string;
  visible?: boolean;
  content: ReactNode;
};

export function TournamentDetailScreen() {
  const { id } = useParams<{ id: string }>();

  const [registerGoalsMatchId, setRegisterGoalsMatchId] = useState<
    string | null
  >(null);

  const { data, isPending, isError, error } = useTournament(id);

  const { mutate: advancePhase, isPending: isAdvancingPhase } =
    useAdvancePhase(id);

  const { tab, setTab } = useTournamentDetailTabs(
    data?.format === 'GROUP_STAGE_KNOCKOUT' ? 'groups' : 'knockout',
  );

  const handleAdvancePhase = (phaseId: string) =>
    advancePhase(phaseId, {
      onSuccess: () => {
        toast.success('Fase avançada — a próxima rodada já foi gerada.');
      },
    });

  useBreadcrumbItems([
    { label: 'Torneios', href: '/tournaments' },
    { label: data?.name ?? '' },
  ]);

  const tournamentFormat = data?.format;

  const tabItems: TabItem[] = [
    {
      value: 'groups',
      label: 'Fase de grupos',
      visible: tournamentFormat === 'GROUP_STAGE_KNOCKOUT',
      content: <TournamentGroupStandings />,
    },
    {
      value: 'knockout',
      label: 'Mata-mata',
      content: <TournamentBracket />,
    },
    {
      value: 'matches',
      label: 'Jogos',
      content: (
        <TournamentFixtures
          onRegisterGoals={setRegisterGoalsMatchId}
          onAdvancePhase={handleAdvancePhase}
          isAdvancingPhase={isAdvancingPhase}
        />
      ),
    },
    {
      value: 'scorers',
      label: 'Artilheiros',
      content: <TopScorersTab />,
    },
    {
      value: 'assists',
      label: 'Líder de assistências',
      content: <TopAssistsTab />,
    },
  ];

  const visibleTabItems = tabItems.filter((item) => item.visible !== false);

  return (
    <>
      {isPending && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-40" />
        </div>
      )}

      {!isPending && (isError || !data) && (
        <p className="text-sm text-destructive">
          {getErrorMessage(error, 'Não foi possível carregar o torneio.')}
        </p>
      )}

      {!isPending && data && (
        <>
          <TournamentDetailDashboard />

          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as TournamentDetailTab)}
            className={'w-full items-center'}
          >
            <TabsList>
              {visibleTabItems.map((item) => (
                <TabsTab key={item.value} value={item.value}>
                  {item.label}
                </TabsTab>
              ))}
            </TabsList>

            {visibleTabItems.map((item) => (
              <TabsPanel key={item.value} value={item.value}>
                {item.content}
              </TabsPanel>
            ))}
          </Tabs>

          <RegisterMatchGoalsDrawer
            key={registerGoalsMatchId}
            tournamentId={data.id}
            matchId={registerGoalsMatchId}
            open={!!registerGoalsMatchId}
            onOpenChange={(open) => {
              if (!open) {
                setRegisterGoalsMatchId(null);
              }
            }}
          />
        </>
      )}
    </>
  );
}
