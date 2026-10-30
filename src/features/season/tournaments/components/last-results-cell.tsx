import { TableCell } from '@/components/ui';
import { cn } from '@/lib';
import type { StandingWithOwner } from '../api';

type LastResultsCellProps = {
  standing: StandingWithOwner;
};

const RESULT_CLASS: Record<'W' | 'D' | 'L', string> = {
  W: 'bg-success',
  D: 'bg-muted-foreground',
  L: 'bg-destructive',
};

export const LastResultsCell = ({ standing }: LastResultsCellProps) => {
  if (standing.last5.length === 0) {
    return <span className="block text-right text-muted-foreground">-</span>;
  }

  return (
    <TableCell>
      <div className="flex justify-end gap-1">
        {standing.last5.map((result, resultIndex) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: last5 is a fixed, fully-replaced list with no stable id
            key={resultIndex}
            className={cn(
              'flex size-2.5 items-center justify-center rounded-full font-semibold text-[9px] text-white',
              RESULT_CLASS[result],
            )}
          ></span>
        ))}
      </div>
    </TableCell>
  );
};
