import type { GoalLeader, NextMatchSummary } from '../api';
import { useTournamentDashboard } from './use-tournament-dashboard';

const getGamesInThisPhase = (playedMatches: number, totalMatches: number) => {
  const value = `${playedMatches}/${totalMatches}`;

  const sub =
    totalMatches > 0
      ? `${Math.round((playedMatches / totalMatches) * 100)}% disputado`
      : 'Nenhum jogo gerado';

  return {
    value,
    sub,
  };
};

const getTopScorer = (topScorer?: GoalLeader | null) => {
  const sub = topScorer
    ? `${topScorer.team.name} · ${topScorer.count} gols`
    : 'Nenhum gol registrado';

  return {
    value: topScorer?.player.name ?? '-',
    sub,
  };
};

const getNextMatch = (nextMatch?: NextMatchSummary | null) => {
  const value = nextMatch
    ? `${nextMatch.homeTeam.name} x ${nextMatch.awayTeam.name}`
    : '-';

  const nextMatchContext = nextMatch
    ? nextMatch.groupLabel
      ? `Grupo ${nextMatch.groupLabel}${nextMatch.round ? ` · Rodada ${nextMatch.round}` : ''}`
      : nextMatch.phaseName
    : null;

  return {
    value,
    sub: nextMatchContext ?? 'Nenhuma partida pendente',
  };
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
});

export const useTournamentDetailDashboard = (id?: string) => {
  const { data: dashboard } = useTournamentDashboard(id);

  const totalMatches = dashboard?.totalMatches ?? 0;
  const playedMatches = dashboard?.playedMatches ?? 0;

  const gamesInThisPhase = getGamesInThisPhase(playedMatches, totalMatches);
  const topScorer = getTopScorer(dashboard?.topScorer);
  const nextMatch = getNextMatch(dashboard?.nextMatch);

  const getCreatedAt = () => {
    if (!dashboard?.createdAt) return '-';

    return dateFormatter.format(new Date(dashboard.createdAt));
  };

  return {
    gamesInThisPhase,
    topScorer,
    nextMatch,
    name: dashboard?.name,
    format: dashboard?.format,
    currentPhase: dashboard?.currentPhase,
    maxTeams: dashboard?.maxTeams,
    createdAt: getCreatedAt(),
  };
};
