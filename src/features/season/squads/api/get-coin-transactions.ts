import { api } from '@/lib';
import type { SquadCoinTransaction } from '../types';

export const getCoinTransactions = (teamId: string) =>
  api
    .get<SquadCoinTransaction[]>(`/squads/${teamId}/coin-transactions`)
    .then((res) => res.data);
