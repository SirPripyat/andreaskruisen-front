import { api } from '@/lib';
import type { NegotiationWindow } from '../types';

export const closeNegotiationWindow = () =>
  api
    .post<NegotiationWindow>('/negotiation-window/close')
    .then((res) => res.data);
