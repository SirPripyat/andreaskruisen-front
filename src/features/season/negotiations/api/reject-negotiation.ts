import { api } from '@/lib';
import type { Negotiation } from '../types';

export const rejectNegotiation = (id: string) =>
  api.patch<Negotiation>(`/negotiations/${id}/reject`).then((res) => res.data);
