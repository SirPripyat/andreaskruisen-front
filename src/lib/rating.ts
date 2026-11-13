export type OverallRatingTier = 'info' | 'success' | 'warning' | 'critical';

export const getOverallRatingTier = (rating: number): OverallRatingTier => {
  if (rating >= 90) return 'info';
  if (rating >= 80) return 'success';
  if (rating >= 65) return 'warning';
  return 'critical';
};

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

const RATING_TIER_BORDER_CLASS: Record<OverallRatingTier, string> = {
  info: 'border-t-info',
  success: 'border-t-success',
  warning: 'border-t-warning',
  critical: 'border-t-critical',
};

export const getOverallRatingBorderClassName = (rating: number): string =>
  RATING_TIER_BORDER_CLASS[getOverallRatingTier(rating)];

export const RATING_TIER_ZONES: {
  from: number;
  to: number;
  className: string;
}[] = [
  { from: 0, to: 65, className: 'bg-critical/50' },
  { from: 65, to: 80, className: 'bg-warning/50' },
  { from: 80, to: 90, className: 'bg-success/50' },
  { from: 90, to: 100, className: 'bg-info/50' },
];
