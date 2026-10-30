import { api } from '@/lib';
import type { MatchDetail } from './tournament';

export type ReplaceMatchGoalsPayload = {
  goals: { scorerId: string; assistId?: string }[];
};

export async function replaceMatchGoals(
  tournamentId: string,
  matchId: string,
  payload: ReplaceMatchGoalsPayload,
) {
  const { data } = await api.put<MatchDetail>(
    `/tournaments/${tournamentId}/matches/${matchId}/goals`,
    payload,
  );
  return data;
}
