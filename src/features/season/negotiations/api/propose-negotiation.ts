import { api } from '@/lib';
import type { Negotiation, ProposeNegotiationPayload } from '../types';

export const proposeNegotiation = (payload: ProposeNegotiationPayload) =>
  api.post<Negotiation>('/negotiations', payload).then((res) => res.data);
