import { getOverallRatingClassName } from '../lib';
import { Badge } from './ui';

type OverallRatingBadgeProps = {
  rating: number | null;
};

export const OverallRatingBadge = ({ rating }: OverallRatingBadgeProps) => {
  if (rating === null) return <span className="text-muted-foreground">-</span>;

  const value = Math.round(rating);

  return (
    <Badge variant="outline" className={getOverallRatingClassName(value)}>
      {value}
    </Badge>
  );
};
