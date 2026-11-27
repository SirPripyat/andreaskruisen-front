import type { RosterBySector, RosterPlayer } from '@/features/season/squads';

export const SECTOR_GROUPS: Record<keyof RosterBySector, string> = {
  attackers: 'Atacantes',
  midfielders: 'Meio-campistas',
  defenders: 'Defensores',
  goalkeepers: 'Goleiros',
};

export const FOOT_LABELS: Record<RosterPlayer['preferredFoot'], string> = {
  LEFT: 'Esquerdo',
  RIGHT: 'Destro',
};
