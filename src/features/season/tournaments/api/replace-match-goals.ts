import { api } from '@/lib';
import type { MatchDetail } from './tournament';

export type ReplaceMatchGoalsPayload = {
  goals: { scorerId: string; assistId?: string }[];
  // Obrigatório quando a partida é KNOCKOUT e termina empatada no tempo
  // normal; não deve ser enviado fora desse caso (a API rejeita os dois
  // jeitos errados).
  penalties?: { homeScore: number; awayScore: number };
};

export const replaceMatchGoals = async (
  tournamentId: string,
  matchId: string,
  payload: ReplaceMatchGoalsPayload,
) => {
  const { data } = await api.put<MatchDetail>(
    `/tournaments/${tournamentId}/matches/${matchId}/goals`,
    payload,
  );
  return data;
};
