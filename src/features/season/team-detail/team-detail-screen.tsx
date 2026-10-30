import { UserIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useParams } from 'react-router';
import { StatTile } from '@/components';
import {
  Badge,
  Skeleton,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@/components/ui';
import { useSelectedSeason } from '@/features/admin/seasons';
import { TeamTitlesList, useTeam, useTeamTitles } from '@/features/admin/teams';
import { useRoster, useSeasonSquads } from '@/features/season/squads';
import { useTransfers } from '@/features/season/transfers';
import { getOverallRatingClassName } from '@/lib';
import { useBreadcrumbItems } from '../../../hooks';
import {
  computeBestXi,
  TeamBench,
  TeamLineupPitch,
  TeamRosterTable,
  TeamTransfersList,
} from './components';
import { type TeamDetailTab, useTeamDetailTabs } from './hooks';

function RatingTile({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 bg-muted/40 p-3">
      <span className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      {value === null ? (
        <span className="font-display font-bold text-lg text-muted-foreground">
          -
        </span>
      ) : (
        <Badge
          variant="outline"
          className={`${getOverallRatingClassName(Math.round(value))} w-fit text-base`}
        >
          {Math.round(value)}
        </Badge>
      )}
    </div>
  );
}

export const TeamDetailScreen = () => {
  const { id } = useParams<{ id: string }>();

  const { data: team, isPending } = useTeam(id);
  const { selectedSeason } = useSelectedSeason();
  const { data: seasonSquads } = useSeasonSquads(selectedSeason?.id);
  const { tab, setTab } = useTeamDetailTabs('overview');

  const needsRoster =
    tab === 'overview' || tab === 'roster' || tab === 'lineup';
  const needsTitles = tab === 'overview' || tab === 'titles';
  const needsTransfers = tab === 'transfers';

  const { data: roster, isPending: isRosterPending } = useRoster(
    selectedSeason?.id,
    id,
    needsRoster,
  );
  const { data: transfers, isPending: isTransfersPending } = useTransfers(
    selectedSeason?.id,
    needsTransfers,
  );
  const { data: titles, isPending: isTitlesPending } = useTeamTitles(
    id,
    needsTitles,
  );

  const manager = useMemo(
    () => seasonSquads?.find((squad) => squad.team.id === id)?.user ?? null,
    [seasonSquads, id],
  );

  const bestXi = useMemo(() => computeBestXi(roster ?? []), [roster]);
  const xiPlayerIds = useMemo(
    () => new Set(bestXi.flatMap((a) => (a.player ? [a.player.id] : []))),
    [bestXi],
  );
  const bench = useMemo(
    () => (roster ?? []).filter((player) => !xiPlayerIds.has(player.id)),
    [roster, xiPlayerIds],
  );

  useBreadcrumbItems([{ label: team?.name ?? '' }]);

  return (
    <>
      {!isPending && team && (
        <>
          <div className="gap-0 overflow-hidden rounded-xl border-t-4 border-t-accent bg-card py-0 ring-1 ring-foreground/10">
            <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
              <div className="flex items-start gap-3">
                <img
                  src={team.crestUrl}
                  alt={team.name}
                  className="size-14 shrink-0 object-contain"
                  onError={(event) => {
                    event.currentTarget.style.visibility = 'hidden';
                  }}
                />
                <div>
                  <h1 className="font-display font-extrabold text-3xl uppercase tracking-tight text-balance">
                    {team.name}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{team.league.name}</Badge>
                    {manager ? (
                      <Badge className="gap-1.5 border-transparent bg-success-surface text-success">
                        <UserIcon className="size-3.5" />
                        Gestor: {manager.name}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Sem gestor nesta temporada
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-y divide-border border-t lg:grid-cols-4 lg:divide-y-0">
              <RatingTile label="Overall" value={team.averageOverallRating} />
              <RatingTile label="Ataque" value={team.averageAttackRating} />
              <RatingTile
                label="Meio-campo"
                value={team.averageMidfieldRating}
              />
              <RatingTile label="Defesa" value={team.averageDefenseRating} />
            </div>
          </div>

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
            </TabsList>

            <TabsPanel value="overview">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
                  <span className="font-display font-bold text-sm uppercase">
                    Elenco
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <StatTile
                      label="Jogadores"
                      value={
                        isRosterPending ? '-' : String(roster?.length ?? 0)
                      }
                      sub="Vinculados nesta temporada"
                    />
                    <StatTile
                      label="Títulos"
                      value={
                        isTitlesPending ? '-' : String(titles?.length ?? 0)
                      }
                      sub="Conquistados pelo clube"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
                  <span className="font-display font-bold text-sm uppercase">
                    Último título
                  </span>
                  {isTitlesPending ? (
                    <Skeleton className="h-12 w-full" />
                  ) : titles && titles.length > 0 ? (
                    <div>
                      <p className="font-medium text-sm">
                        {titles[0].tournamentName}
                      </p>
                      <p className="font-mono text-muted-foreground text-xs">
                        Temporada {titles[0].seasonName}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Este time ainda não foi campeão de nenhum torneio.
                    </p>
                  )}
                </div>
              </div>
            </TabsPanel>

            <TabsPanel value="roster">
              <TeamRosterTable
                roster={roster ?? []}
                xiPlayerIds={xiPlayerIds}
                isPending={isRosterPending}
              />
            </TabsPanel>

            <TabsPanel value="lineup">
              <div className="flex flex-col gap-3">
                <TeamLineupPitch
                  assignments={bestXi}
                  isPending={isRosterPending}
                />
                <div>
                  <span className="mb-2 block font-display font-bold text-sm uppercase">
                    Banco
                  </span>
                  <TeamBench bench={bench} isPending={isRosterPending} />
                </div>
              </div>
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
          </Tabs>
        </>
      )}
    </>
  );
};
