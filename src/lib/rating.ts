export function getOverallRatingClassName(rating: number) {
  if (rating >= 90) {
    return 'border-transparent bg-info-surface text-info';
  }
  if (rating >= 80) {
    return 'border-transparent bg-success-surface text-success';
  }
  if (rating >= 65) {
    return 'border-transparent bg-warning-surface text-warning';
  }
  return 'border-transparent bg-critical-surface text-critical';
}
