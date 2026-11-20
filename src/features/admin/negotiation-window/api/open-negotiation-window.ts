import { api } from '@/lib';
import type { NegotiationWindow } from '../types';

export type OpenNegotiationWindowPayload = {
  feeEnabled: boolean;
};

export const openNegotiationWindow = (payload: OpenNegotiationWindowPayload) =>
  api
    .post<NegotiationWindow>('/negotiation-window/open', payload)
    .then((res) => res.data);
