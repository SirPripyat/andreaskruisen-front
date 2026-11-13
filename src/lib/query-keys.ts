import type { ListLeaguesQuery } from '@/features/admin/leagues/types';
import type { ListNationalitiesQuery } from '@/features/admin/nationalities/types';
import type { ListPlayersQuery } from '@/features/admin/players/types';
import type { ListTeamsQuery } from '@/features/admin/teams/types';
import type { ListClubsQuery } from '@/features/season/clubs/types';
import type { ListTournamentMatchesQuery } from '@/features/season/tournaments/api';

export const queryKeys = {
  me: {
    detail: ['me'] as const,
    activeSeason: ['me', 'seasons', 'active'] as const,
  },

  avatar: ['avatar'] as const,

  users: ['users'] as const,

  players: {
    all: ['players'] as const,
    list: (query: ListPlayersQuery) => ['players', query] as const,
  },

  seasonPlayers: {
    all: ['season-players'] as const,
    list: (query: ListPlayersQuery) => ['season-players', query] as const,
    detail: (id: string | undefined) => ['season-player', id] as const,
    similar: (id: string | undefined, limit?: number) =>
      ['season-player', id, 'similar', limit] as const,
  },

  leagues: {
    all: ['leagues'] as const,
    list: (query: ListLeaguesQuery) => ['leagues', query] as const,
    detail: (id: string | undefined) => ['league', id] as const,
  },

  nationalities: {
    all: ['nationalities'] as const,
    list: (query: ListNationalitiesQuery) => ['nationalities', query] as const,
    detail: (id: string | undefined) => ['nationality', id] as const,
  },

  seasons: {
    all: ['seasons'] as const,
    detail: (id: string | undefined) => ['season', id] as const,
  },

  teams: {
    all: ['teams'] as const,
    list: (query: ListTeamsQuery) => ['teams', query] as const,
  },

  team: {
    all: ['team'] as const,
    detail: (id: string | undefined) => ['team', id] as const,
    titles: (id: string | undefined) => ['team-titles', id] as const,
  },

  clubs: (query: ListClubsQuery) => ['clubs', query] as const,

  favorites: ['favorites'] as const,

  transfers: ['transfers'] as const,

  lineup: {
    all: ['lineup'] as const,
    detail: (teamId: string | undefined) => ['lineup', teamId] as const,
  },

  roster: {
    all: ['roster'] as const,
    detail: (teamId: string | undefined) => ['roster', teamId] as const,
  },

  squads: ['squads'] as const,

  tournaments: {
    all: ['tournaments'] as const,
    detail: (tournamentId: string | undefined) =>
      ['tournament', tournamentId] as const,
    dashboard: (tournamentId: string | undefined) =>
      ['tournament', tournamentId, 'dashboard'] as const,
    fixtures: (tournamentId: string | undefined) =>
      ['tournament', tournamentId, 'fixtures'] as const,
    matches: (
      tournamentId: string | undefined,
      query: ListTournamentMatchesQuery,
    ) => ['tournament', tournamentId, 'matches', query] as const,
    match: (tournamentId: string | undefined, matchId: string | undefined) =>
      ['tournament', tournamentId, 'matches', matchId] as const,
    situation: (
      tournamentId: string | undefined,
      query?: { onlyOwnedTeams?: boolean; round?: number },
    ) => ['tournament', tournamentId, 'situation', query] as const,
    topAssists: (tournamentId: string | undefined) =>
      ['tournament', tournamentId, 'top-assists'] as const,
    topScorers: (tournamentId: string | undefined) =>
      ['tournament', tournamentId, 'top-scorers'] as const,
  },
} as const;
