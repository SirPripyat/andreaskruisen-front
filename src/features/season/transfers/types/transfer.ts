import type { PlayerListItem, TeamWithRatings } from '@/features/admin';

// Troca de dois jogadores entre dois times, na mesma temporada — sem custo
// (ver CLAUDE.md do backend): outgoing*/incoming* guardam o time de cada
// jogador ANTES da troca, não depois.
export type Transfer = {
  transferId: string;
  player: Pick<PlayerListItem, 'id' | 'name' | 'photoUrl'>;
  date: string;
  requestedBy: { id: string; name: string };
  fromTeam: Pick<TeamWithRatings, 'id' | 'name' | 'crestUrl'>;
  toTeam: Pick<TeamWithRatings, 'id' | 'name' | 'crestUrl'>;
};
