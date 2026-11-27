import { toast } from 'sonner';

const MAX_PLAYERS_PER_SIDE = 2;

export const togglePlayerId = (selectedIds: string[], playerId: string) => {
  if (selectedIds.includes(playerId)) {
    return selectedIds.filter((id) => id !== playerId);
  }
  if (selectedIds.length >= MAX_PLAYERS_PER_SIDE) {
    toast.error(`Máximo de ${MAX_PLAYERS_PER_SIDE} jogadores por lado.`);
    return selectedIds;
  }
  return [...selectedIds, playerId];
};
