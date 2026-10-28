import { PencilIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { StatTile } from '@/components';
import {
  Badge,
  Button,
  Skeleton,
  Switch,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@/components/ui';
import { useMe } from '@/features/auth';
import { getErrorMessage } from '@/lib';
import { useBreadcrumbStore } from '@/stores';
import type { TeamOwner } from './api';
import { TOURNAMENT_FORMAT_LABELS } from './api';
import {
  DeleteTournamentDialog,
  EditTournamentDrawer,
  GoalLeadersList,
  RegisterMatchGoalsDrawer,
  TournamentBracket,
  TournamentFixtures,
  TournamentGroupStandings,
} from './components';
import {
  useAdvancePhase,
  useTournament,
  useTournamentAllMatches,
  useTournamentMatches,
  useTournamentSituation,
  useTournamentStats,
} from './hooks';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
});

// Maior fase possível (GROUP_STAGE com 24 times) gera 36 partidas; folga
// confortável pra nunca precisar paginar essa página de detalhes.
const MATCHES_PAGE_SIZE = 100;

// A fase de grupos é sempre a primeira (ver criação do torneio em
// tournaments.service.ts) — nunca muda de order.
const GROUP_PHASE_ORDER = 1;

export function TournamentDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [registerGoalsMatchId, setRegisterGoalsMatchId] = useState<
    string | null
  >(null);
  const [onlyOwnedTeams, setOnlyOwnedTeams] = useState(false);

  const { data, isPending, isError, error } = useTournament(id);
  // A fase de grupos é sempre sa de order 1 (ver criação do torneio) — busca
  // explícita por ela pra não perder a classificação quando o mata-mata
  // (uma fase posterior) já começou e a fase vigente passa a ser ele.
  const { data: groupSituation } = useTournamentSituation(id, {
    onlyOwnedTeams,
    round: GROUP_PHASE_ORDER,
  });
  const { data: matchesPage } = useTournamentMatches(id, {
    page: 1,
    pageSize: MATCHES_PAGE_SIZE,
  });
  const { phases: matchesByPhase } = useTournamentAllMatches(
    id,
    data?.currentPhase?.order ?? 0,
    MATCHES_PAGE_SIZE,
  );
  const { data: stats } = useTournamentStats(id);
  const { mutate: advancePhase, isPending: isAdvancingPhase } =
    useAdvancePhase(id);

  function handleAdvancePhase(phaseId: string) {
    advancePhase(phaseId, {
      onSuccess: () => {
        toast.success('Fase avançada — a próxima rodada já foi gerada.');
      },
    });
  }

  // O chaveamento usa os placares reais das partidas (ver MatchListItem),
  // ao contrário do confronto "cru" da situação — e cobre todas as rodadas
  // de mata-mata já geradas (quartas, semi, final...), não só a vigente.
  const knockoutRounds = useMemo(
    () => matchesByPhase.filter(({ phase }) => phase.type === 'KNOCKOUT'),
    [matchesByPhase],
  );

  const setBreadcrumbItems = useBreadcrumbStore(
    (state) => state.setBreadcrumbItems,
  );
  const clearBreadcrumbItems = useBreadcrumbStore(
    (state) => state.clearBreadcrumbItems,
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    setBreadcrumbItems([
      { label: 'Torneios', href: '/tournaments' },
      { label: data.name },
    ]);
    return () => clearBreadcrumbItems();
  }, [data, setBreadcrumbItems, clearBreadcrumbItems]);

  const crestByTeamId = useMemo(() => {
    const map = new Map<string, string>();
    for (const { matches } of matchesByPhase) {
      for (const match of matches) {
        map.set(match.homeTeam.id, match.homeTeam.crestUrl);
        map.set(match.awayTeam.id, match.awayTeam.crestUrl);
      }
    }
    return map;
  }, [matchesByPhase]);

  const ownerByTeamId = useMemo(() => {
    const map = new Map<string, TeamOwner>();
    for (const standings of Object.values(groupSituation?.groups ?? {})) {
      for (const standing of standings) {
        if (standing.owner) {
          map.set(standing.teamId, standing.owner);
        }
      }
    }
    // Torneios sem fase de grupos (formato KNOCKOUT) não têm `groups` nem
    // na fase 1 — os donos aparecem direto nos confrontos.
    for (const confronto of groupSituation?.matches ?? []) {
      if (confronto.homeTeam.owner) {
        map.set(confronto.homeTeam.id, confronto.homeTeam.owner);
      }
      if (confronto.awayTeam.owner) {
        map.set(confronto.awayTeam.id, confronto.awayTeam.owner);
      }
    }
    return map;
  }, [groupSituation]);

  const matches = matchesPage?.data ?? [];
  const totalMatchesCount = matches.length;
  const playedMatchesCount = matches.filter(
    (match) => match.homeScore !== null && match.awayScore !== null,
  ).length;
  const topScorer = stats?.topScorers[0];
  const nextMatch = matches.find(
    (match) => match.homeScore === null || match.awayScore === null,
  );
  const nextMatchContext = nextMatch
    ? nextMatch.groupLabel
      ? `Grupo ${nextMatch.groupLabel}${nextMatch.round ? ` · Rodada ${nextMatch.round}` : ''}`
      : (data?.currentPhase?.name ?? null)
    : null;

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
          <div className="gap-0 overflow-hidden rounded-xl border-t-4 border-t-accent bg-card py-0 ring-1 ring-foreground/10">
            <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
              <div>
                <h1 className="font-display font-extrabold text-3xl uppercase tracking-tight text-balance">
                  {data.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {TOURNAMENT_FORMAT_LABELS[data.format]}
                  </Badge>
                  {data.currentPhase && (
                    <Badge className="border-transparent bg-accent-surface text-accent">
                      Fase atual · {data.currentPhase.name}
                    </Badge>
                  )}
                  <Badge variant="secondary">{data.maxTeams} times</Badge>
                </div>
                <p className="mt-2 text-muted-foreground text-xs">
                  Criado em {dateFormatter.format(new Date(data.createdAt))}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditOpen(true)}>
                  <PencilIcon />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2Icon />
                  Excluir
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-y divide-border border-t lg:grid-cols-4 lg:divide-y-0">
              <StatTile
                label="Times"
                value={String(data.maxTeams)}
                sub="Inscritos no torneio"
              />
              <StatTile
                label="Jogos nesta fase"
                value={`${playedMatchesCount}/${totalMatchesCount}`}
                sub={
                  totalMatchesCount > 0
                    ? `${Math.round((playedMatchesCount / totalMatchesCount) * 100)}% disputado`
                    : 'Nenhum jogo gerado'
                }
              />
              <StatTile
                label="Artilheiro"
                value={topScorer?.player.name ?? '-'}
                sub={
                  topScorer
                    ? `${topScorer.team.name} · ${topScorer.count} gols`
                    : 'Nenhum gol registrado'
                }
              />
              <StatTile
                label="Próxima partida"
                value={
                  nextMatch
                    ? `${nextMatch.homeTeam.name} x ${nextMatch.awayTeam.name}`
                    : '-'
                }
                sub={nextMatchContext ?? 'Nenhuma partida pendente'}
              />
            </div>
          </div>

          <Tabs defaultValue="groups" className={'w-full items-center'}>
            <TabsList>
              <TabsTab value="groups">Fase de grupos</TabsTab>
              <TabsTab value="matches">Jogos</TabsTab>
              <TabsTab value="knockout">Mata-mata</TabsTab>
              <TabsTab value="scorers">Artilheiros</TabsTab>
              <TabsTab value="assists">Líder de assistências</TabsTab>
            </TabsList>

            <TabsPanel value="groups">
              <TournamentGroupStandings
                groups={groupSituation?.groups ?? {}}
                crestByTeamId={crestByTeamId}
                showQualifyZone={data.format === 'GROUP_STAGE_KNOCKOUT'}
                filters={
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="only-owned-teams"
                      className="text-muted-foreground text-sm"
                    >
                      Somente times de usuários
                    </label>
                    <Switch
                      id="only-owned-teams"
                      checked={onlyOwnedTeams}
                      onCheckedChange={setOnlyOwnedTeams}
                    />
                  </div>
                }
              />
            </TabsPanel>

            <TabsPanel value="knockout">
              <TournamentBracket
                rounds={knockoutRounds}
                ownerByTeamId={ownerByTeamId}
              />
            </TabsPanel>

            <TabsPanel value="scorers">
              <GoalLeadersList
                leaders={stats?.topScorers ?? []}
                countLabel="gols"
                emptyMessage="Nenhum gol registrado ainda."
              />
            </TabsPanel>

            <TabsPanel value="assists">
              <GoalLeadersList
                leaders={stats?.topAssists ?? []}
                countLabel="assistências"
                emptyMessage="Nenhuma assistência registrada ainda."
              />
            </TabsPanel>

            <TabsPanel value="matches">
              <TournamentFixtures
                phases={matchesByPhase}
                ownerByTeamId={ownerByTeamId}
                onRegisterGoals={setRegisterGoalsMatchId}
                onAdvancePhase={handleAdvancePhase}
                isAdvancingPhase={isAdvancingPhase}
              />
            </TabsPanel>
          </Tabs>

          <EditTournamentDrawer
            key={data.id}
            tournament={data}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <DeleteTournamentDialog
            tournamentId={data.id}
            tournamentName={data.name}
            seasonId={data.seasonId}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onDeleted={() => navigate('/tournaments')}
          />
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
