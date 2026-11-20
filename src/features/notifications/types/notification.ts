export const NOTIFICATION_TYPES = [
  'TRANSFER_COMPLETED',
  'TOURNAMENT_PRIZE_AWARDED',
  'AUDIT_DISCREPANCY_FOUND',
  'NEGOTIATION_PROPOSED',
  'NEGOTIATION_ACCEPTED',
  'NEGOTIATION_REJECTED',
  'SEASON_STARTED',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
};

export type ListNotificationsQuery = {
  page: number;
  pageSize: number;
};
