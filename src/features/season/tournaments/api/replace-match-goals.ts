import { api } from '@/lib';
import type { MatchDetail } from '../types';

export type ReplaceMatchGoalsPayload = {
  goals: { scorerId: string; assistId?: string }[];
  // Obrigatório quando a partida é KNOCKOUT e termina empatada no tempo
  // normal; não deve ser enviado fora desse caso (a API rejeita os dois
  // jeitos errados).
  penalties?: { homeScore: number; awayScore: number };
};

export const replaceMatchGoals = (
  matchId: string,
  payload: ReplaceMatchGoalsPayload,
) =>
  api
    .put<MatchDetail>(`/matches/${matchId}/goals`, payload)
    .then((res) => res.data);
