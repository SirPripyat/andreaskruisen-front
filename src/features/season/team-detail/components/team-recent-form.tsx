import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import type { RecentMatchResult } from '@/features/admin/teams';

type TeamRecentFormProps = {
  matches: RecentMatchResult[];
};

type ResultKey = RecentMatchResult['result'];

const RESULT_META: Record<
  ResultKey,
  {
    word: string;
    points: number;
    chipClassName: string;
    textClassName: string;
    barClassName: string;
  }
> = {
  V: {
    word: 'Vitória',
    points: 3,
    chipClassName: 'bg-success text-white',
    textClassName: 'text-success',
    barClassName: 'bg-success',
  },
  E: {
    word: 'Empate',
    points: 1,
    chipClassName: 'bg-warning text-white',
    textClassName: 'text-warning',
    barClassName: 'bg-warning',
  },
  D: {
    word: 'Derrota',
    points: 0,
    chipClassName: 'bg-critical text-white',
    textClassName: 'text-critical',
    barClassName: 'border border-critical bg-critical-surface',
  },
};

const BAR_HEIGHT_PERCENT: Record<ResultKey, number> = {
  V: 100,
  E: 34,
  D: 12,
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' });

const sortByPlayedAtAsc = (matches: RecentMatchResult[]) =>
  [...matches].sort(
    (a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime(),
  );

export const TeamRecentFormChips = ({ matches }: TeamRecentFormProps) => {
  const recent = sortByPlayedAtAsc(matches).slice(-5);

  if (recent.length === 0) return null;

  return (
    <div className={'flex items-center gap-1.5'}>
      <span className={'text-muted-foreground text-xs'}>Forma</span>
      {recent.map((match) => {
        const meta = RESULT_META[match.result];

        return (
          <Tooltip key={match.matchId}>
            <TooltipTrigger
              render={
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full font-mono font-semibold text-xs ${meta.chipClassName}`}
                >
                  {match.result}
                </span>
              }
            />
            <TooltipContent>
              {meta.word} vs {match.opponent.name} {match.goalsFor}-
              {match.goalsAgainst}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export const TeamRecentForm = ({ matches }: TeamRecentFormProps) => {
  if (matches.length === 0) {
    return (
      <p className={'text-muted-foreground text-sm'}>
        Nenhum jogo recente para exibir.
      </p>
    );
  }

  const chronological = sortByPlayedAtAsc(matches);
  const mostRecentFirst = [...chronological].reverse();

  return (
    <div className={'flex flex-col gap-3'}>
      <div className={'grid grid-flow-col gap-1.5'}>
        {chronological.map((match) => {
          const meta = RESULT_META[match.result];

          return (
            <Tooltip key={match.matchId}>
              <TooltipTrigger
                render={
                  <button
                    type={'button'}
                    className={'flex flex-col items-stretch gap-1 outline-none'}
                  >
                    <span
                      className={
                        'flex h-14 items-end border-b border-border-strong'
                      }
                    >
                      <span
                        style={{
                          height: `${BAR_HEIGHT_PERCENT[match.result]}%`,
                        }}
                        className={`w-full rounded-t ${meta.barClassName}`}
                      />
                    </span>
                    <span
                      className={`text-center font-mono text-[11px] ${meta.textClassName}`}
                    >
                      {match.result}
                    </span>
                  </button>
                }
              />
              <TooltipContent>
                <div className={'flex flex-col gap-0.5'}>
                  <span className={'font-semibold'}>
                    vs {match.opponent.name}
                  </span>
                  <span className={'text-background/70'}>
                    {match.goalsFor}-{match.goalsAgainst} · {meta.word} ·{' '}
                    {meta.points} pts
                  </span>
                  <span className={'text-background/70'}>
                    {dateFormatter.format(new Date(match.playedAt))}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <span className={'text-[11px] text-muted-foreground'}>
        Altura da barra = pontos do jogo (3 · 1 · 0). Passe o mouse para ver o
        placar.
      </span>

      <div className={'flex flex-col border-t'}>
        {mostRecentFirst.map((match) => {
          const meta = RESULT_META[match.result];

          return (
            <div
              key={match.matchId}
              className={
                'flex items-center gap-3 border-b py-2.5 last:border-0'
              }
            >
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full font-mono font-semibold text-xs ${meta.chipClassName}`}
              >
                {match.result}
              </span>

              <div className={'flex min-w-0 flex-1 flex-col'}>
                <span className={'truncate font-medium text-sm'}>
                  {match.opponent.name}
                </span>
                <span className={'text-muted-foreground text-xs'}>
                  {dateFormatter.format(new Date(match.playedAt))}
                </span>
              </div>

              <span className={'font-mono font-semibold text-sm'}>
                {match.goalsFor}-{match.goalsAgainst}
              </span>

              <span
                className={
                  'w-10 shrink-0 text-right font-mono text-muted-foreground text-xs'
                }
              >
                +{meta.points} pts
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
