import { api } from '@/lib';
import type { TransferQuote, TransferQuoteQuery } from '../types';

export const getTransferQuote = (query: TransferQuoteQuery) =>
  api
    .get<TransferQuote>('/transfers/quote', { params: query })
    .then((res) => res.data);
