import { Badge } from '@/components/ui';
import { getOverallRatingClassName } from '@/lib';

type RatingTileProps = {
  label: string;
  value: number | null;
};

export const RatingTile = ({ label, value }: RatingTileProps) => {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      {value === null ? (
        <span className="font-display font-bold text-lg text-muted-foreground">
          -
        </span>
      ) : (
        <Badge
          variant="outline"
          className={`${getOverallRatingClassName(Math.round(value))} w-fit text-base`}
        >
          {Math.round(value)}
        </Badge>
      )}
    </div>
  );
};
