// Troca de dois jogadores entre dois times, na mesma temporada — sem custo
// (ver CLAUDE.md do backend): outgoing*/incoming* guardam o time de cada
// jogador ANTES da troca, não depois.
export type Transfer = {
  id: string;
  seasonId: string;
  createdAt: string;
  requestedBy: { id: string; name: string };
  outgoingPlayer: { id: string; name: string; photoUrl: string };
  outgoingTeam: { id: string; name: string; crestUrl: string };
  incomingPlayer: { id: string; name: string; photoUrl: string };
  incomingTeam: { id: string; name: string; crestUrl: string };
};
