import {
  CircleAlertIcon,
  LayersIcon,
  SwordsIcon,
  TableIcon,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { cn } from '@/lib';
import {
  TEAM_COUNT_RULES,
  TOURNAMENT_FORMAT_LABELS,
  TOURNAMENT_FORMATS,
  type TournamentFormat,
} from '../api';

const FORMAT_DESCRIPTIONS: Record<TournamentFormat, string> = {
  LEAGUE: 'Todos jogam entre si num turno único — o líder da tabela vence.',
  KNOCKOUT: 'Eliminação direta a cada rodada, sem segunda chance.',
  GROUP_STAGE_KNOCKOUT: 'Classificação em grupos seguida de eliminatórias.',
};

const FORMAT_ICONS: Record<
  TournamentFormat,
  ComponentType<{ className?: string }>
> = {
  LEAGUE: TableIcon,
  KNOCKOUT: SwordsIcon,
  GROUP_STAGE_KNOCKOUT: LayersIcon,
};

const formatRange = (rule: { allowed: number[] }) =>
  `${rule.allowed[0]}–${rule.allowed[rule.allowed.length - 1]} times`;

export const TournamentFormatPicker = ({
  format,
  onFormatChange,
  maxTeams,
  onMaxTeamsChange,
  error,
}: {
  format: TournamentFormat;
  onFormatChange: (format: TournamentFormat) => void;
  maxTeams: string;
  onMaxTeamsChange: (value: string) => void;
  error?: string;
}) => {
  const rule = TEAM_COUNT_RULES[format];

  return (
    <div className={'flex flex-col gap-3'}>
      <div className={'grid grid-cols-1 gap-2.5 sm:grid-cols-3'}>
        {TOURNAMENT_FORMATS.map((item) => {
          const Icon = FORMAT_ICONS[item];
          const selected = item === format;

          return (
            <button
              key={item}
              type={'button'}
              aria-pressed={selected}
              onClick={() => onFormatChange(item)}
              className={cn(
                'flex flex-col gap-2 rounded-xl border p-3 text-left transition-colors',
                selected
                  ? 'border-accent bg-accent-surface'
                  : 'border-border hover:border-border-strong',
              )}
            >
              <span
                className={cn(
                  'flex size-7 items-center justify-center rounded-md bg-background text-muted-foreground',
                  selected && 'bg-accent text-accent-foreground',
                )}
              >
                <Icon className={'size-4'} />
              </span>
              <span className={'font-semibold text-sm'}>
                {TOURNAMENT_FORMAT_LABELS[item]}
              </span>
              <span className={'text-muted-foreground text-xs leading-snug'}>
                {FORMAT_DESCRIPTIONS[item]}
              </span>
              <span
                className={cn(
                  'border-t border-dashed pt-1.5 font-mono text-[11px] text-muted-foreground',
                  selected && 'border-accent/30 text-accent-hover',
                )}
              >
                {formatRange(TEAM_COUNT_RULES[item])}
              </span>
            </button>
          );
        })}
      </div>

      <div className={'flex flex-wrap items-center gap-2'}>
        {rule.allowed.map((count) => {
          const selected = maxTeams === String(count);
          return (
            <button
              key={count}
              type={'button'}
              aria-pressed={selected}
              onClick={() => onMaxTeamsChange(String(count))}
              className={cn(
                'flex h-8 min-w-10 items-center justify-center rounded-md border px-2.5 font-mono font-semibold text-sm transition-colors',
                selected
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border-strong hover:border-accent',
              )}
            >
              {count}
            </button>
          );
        })}
      </div>

      {error && (
        <div className={'flex items-center gap-1.5 text-destructive text-sm'}>
          <CircleAlertIcon className={'size-3.5 shrink-0'} />
          {error}
        </div>
      )}
    </div>
  );
};
