export type OverallRatingTier = 'info' | 'success' | 'warning' | 'critical';

export function getOverallRatingTier(rating: number): OverallRatingTier {
  if (rating >= 90) return 'info';
  if (rating >= 80) return 'success';
  if (rating >= 65) return 'warning';
  return 'critical';
}

const RATING_TIER_SURFACE_CLASS: Record<OverallRatingTier, string> = {
  info: 'bg-info-surface text-info',
  success: 'bg-success-surface text-success',
  warning: 'bg-warning-surface text-warning',
  critical: 'bg-critical-surface text-critical',
};

export const getOverallRatingClassName = (rating: number): string =>
  RATING_TIER_SURFACE_CLASS[getOverallRatingTier(rating)];

const RATING_TIER_SOLID_CLASS: Record<OverallRatingTier, string> = {
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-critical',
};

export const getOverallRatingIndicatorClassName = (rating: number): string =>
  RATING_TIER_SOLID_CLASS[getOverallRatingTier(rating)];
