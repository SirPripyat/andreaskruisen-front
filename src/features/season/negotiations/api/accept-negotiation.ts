import { api } from '@/lib';
import type { Negotiation } from '../types';

export const acceptNegotiation = (id: string) =>
  api.patch<Negotiation>(`/negotiations/${id}/accept`).then((res) => res.data);
