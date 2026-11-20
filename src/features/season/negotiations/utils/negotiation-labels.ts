import type { NegotiationClauseType, NegotiationStatus } from '../types';

export const CLAUSE_TYPE_LABELS: Record<NegotiationClauseType, string> = {
  LEI_DO_EX: 'Lei do Ex',
  DIREITO_DE_RECOMPRA: 'Direito de recompra',
  PREFERENCIA_DE_COMPRA: 'Preferência de compra',
  BONUS_POR_TITULO: 'Bônus por título',
};

export const STATUS_LABELS: Record<NegotiationStatus, string> = {
  PENDING: 'Pendente',
  ACCEPTED: 'Aceita',
  REJECTED: 'Rejeitada',
};

export const STATUS_SPINE_CLASS: Record<NegotiationStatus, string> = {
  PENDING: 'bg-warning',
  ACCEPTED: 'bg-success',
  REJECTED: 'bg-critical',
};
