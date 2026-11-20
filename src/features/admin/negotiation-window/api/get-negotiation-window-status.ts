import { api } from '@/lib';
import type { NegotiationWindowStatus } from '../types';

export const getNegotiationWindow = () =>
  api
    .get<NegotiationWindowStatus>('/negotiation-window')
    .then((res) => res.data);
