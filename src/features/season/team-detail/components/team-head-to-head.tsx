import type { HeadToHeadRecord } from '@/features/admin/teams';
import { TeamChip } from '@/features/season/tournaments';
import { cn } from '@/lib';

type TeamHeadToHeadProps = {
  biggestVictim: HeadToHeadRecord | null;
  biggestTormentor: HeadToHeadRecord | null;
};

type HeadToHeadRowProps = {
  label: string;
  record: HeadToHeadRecord;
  accentClassName: string;
};

const HeadToHeadRow = ({
  label,
  record,
  accentClassName,
}: HeadToHeadRowProps) => {
  return (
    <div className={'flex items-center justify-between gap-2'}>
      <div className={'flex min-w-0 flex-col gap-1'}>
        <span
          className={
            'font-semibold text-[11px] text-muted-foreground uppercase tracking-wide'
          }
        >
          {label}
        </span>
        <TeamChip
          teamId={record.opponent.id}
          name={record.opponent.name}
          crestUrl={record.opponent.crestUrl}
        />
      </div>
      <span className={cn('shrink-0 font-mono text-sm', accentClassName)}>
        {record.wins}V {record.draws}E {record.losses}D
      </span>
    </div>
  );
};

export const TeamHeadToHead = ({
  biggestVictim,
  biggestTormentor,
}: TeamHeadToHeadProps) => {
  if (!biggestVictim && !biggestTormentor) {
    return (
      <p className={'text-muted-foreground text-sm'}>
        Sem confrontos suficientes nesta temporada.
      </p>
    );
  }

  return (
    <div className={'flex flex-col gap-3'}>
      {biggestVictim && (
        <HeadToHeadRow
          label={'Maior vítima'}
          record={biggestVictim}
          accentClassName={'text-success'}
        />
      )}
      {biggestTormentor && (
        <HeadToHeadRow
          label={'Algoz'}
          record={biggestTormentor}
          accentClassName={'text-destructive'}
        />
      )}
    </div>
  );
};
