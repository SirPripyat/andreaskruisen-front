import type { Formation } from './formation';
import type { RosterPlayer } from './roster-player';

export type LineupOverview = {
  formation: Formation | null;
  starters: RosterPlayer[];
  bench: RosterPlayer[];
};
