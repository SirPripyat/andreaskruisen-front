import { api } from '@/lib';
import type { ListNegotiationsQuery, Negotiation } from '../types';

export const listNegotiations = (query: ListNegotiationsQuery) =>
  api
    .get<Negotiation[]>('/negotiations', { params: query })
    .then((res) => res.data);
