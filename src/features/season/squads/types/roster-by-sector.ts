import type { RosterPlayer } from './roster-player';

export type RosterBySector = {
  goalkeepers: RosterPlayer[];
  defenders: RosterPlayer[];
  midfielders: RosterPlayer[];
  attackers: RosterPlayer[];
};
