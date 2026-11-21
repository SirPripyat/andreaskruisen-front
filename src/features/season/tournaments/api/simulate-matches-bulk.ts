import { api } from '@/lib';

export type SimulateMatchesBulkResult = {
  tournamentId: string;
  simulatedMatchIds: string[];
  skipped: { matchId: string; reason: string }[];
};

export const simulateMatchesBulk = (matchIds: string[]) =>
  api
    .post<SimulateMatchesBulkResult>('/matches/simulate-bulk', { matchIds })
    .then((res) => res.data);
