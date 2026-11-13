import { api } from '@/lib';
import type { MatchDetail } from '../types';

export const getMatchDetail = (matchId: string) =>
  api.get<MatchDetail>(`/matches/${matchId}`).then((res) => res.data);
