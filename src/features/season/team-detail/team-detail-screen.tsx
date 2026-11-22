import { useParams } from 'react-router';
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui';
import { TeamTitlesList } from '@/features/admin/teams';
import { useClub, useClubTitles } from '@/features/season/clubs';
import { useCoinTransactions, useSeasonSquads } from '@/features/season/squads';
import { useTransfers } from '@/features/season/transfers';
import { useBreadcrumbItems } from '../../../hooks';
import {
  TeamCoinTransactionsList,
  TeamInfoPanel,
  TeamLineupTab,
  TeamOverviewTab,
  TeamRosterTable,
  TeamTransfersList,
} from './components';
import { type TeamDetailTab, useTeamDetailTabs } from './hooks';

export const TeamDetailScreen = () => {
  const { id } = useParams<{ id: string }>();

  const { data: team, isPending } = useClub(id);
  const { data: seasonSquads } = useSeasonSquads();
  const { tab, setTab } = useTeamDetailTabs('overview');

  const needsTitles = tab === 'overview' || tab === 'titles';
  const needsTransfers = tab === 'transfers';
  const needsCoinTransactions = tab === 'coins';

  const { data: transfers, isPending: isTransfersPending } =
    useTransfers(needsTransfers);
  const { data: titles, isPending: isTitlesPending } = useClubTitles(
    id,
    needsTitles,
  );
  const { data: coinTransactions, isPending: isCoinTransactionsPending } =
    useCoinTransactions(id, needsCoinTransactions);

  const manager =
    seasonSquads?.find((squad) => squad.team.id === id)?.user ?? null;

  useBreadcrumbItems([{ label: team?.name ?? '' }]);

  return (
    <>
      {!isPending && team && (
        <>
          <TeamInfoPanel
            crestUrl={team.crestUrl}
            team={team.name}
            league={team.league.name}
            manager={manager?.name ?? null}
            overall={team.averageOverallRating}
            coins={team.coins}
            couponBalance={team.couponBalance}
          />

          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as TeamDetailTab)}
            className="w-full items-center"
          >
            <TabsList>
              <TabsTab value="overview">Visão geral</TabsTab>
              <TabsTab value="roster">Plantel</TabsTab>
              <TabsTab value="lineup">Escalação</TabsTab>
              <TabsTab value="titles">Títulos</TabsTab>
              <TabsTab value="transfers">Transferências</TabsTab>
              <TabsTab value="coins">Extrato</TabsTab>
            </TabsList>

            <TabsPanel value="overview">
              <TeamOverviewTab />
            </TabsPanel>

            <TabsPanel value="roster">
              <TeamRosterTable />
            </TabsPanel>

            <TabsPanel value="lineup">
              <TeamLineupTab managerId={manager?.id ?? null} />
            </TabsPanel>

            <TabsPanel value="titles">
              <TeamTitlesList
                titles={titles ?? []}
                isPending={isTitlesPending}
              />
            </TabsPanel>

            <TabsPanel value="transfers">
              <TeamTransfersList
                teamId={team.id}
                transfers={transfers ?? []}
                isPending={isTransfersPending}
              />
            </TabsPanel>

            <TabsPanel value="coins">
              <TeamCoinTransactionsList
                transactions={coinTransactions ?? []}
                isPending={isCoinTransactionsPending}
              />
            </TabsPanel>
          </Tabs>
        </>
      )}
    </>
  );
};
