import { TableCell } from '@/components/ui';
import { cn } from '@/lib';

type GoalDiffCellProps = {
  value: number;
};

export const GoalDiffCell = ({ value }: GoalDiffCellProps) => {
  return (
    <TableCell
      className={cn(
        'text-right font-medium tabular-nums',
        value > 0 && 'text-success',
        value < 0 && 'text-destructive',
      )}
    >
      {value > 0 ? `+${value}` : value}
    </TableCell>
  );
};
