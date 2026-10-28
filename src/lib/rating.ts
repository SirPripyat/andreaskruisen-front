export function getOverallRatingClassName(rating: number) {
  if (rating >= 90) return 'bg-info-surface text-info';

  if (rating >= 80) return 'bg-success-surface text-success';

  if (rating >= 65) return 'bg-warning-surface text-warning';

  return 'bg-critical-surface text-critical';
}
