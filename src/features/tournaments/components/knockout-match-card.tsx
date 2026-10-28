import { EyeIcon, LockIcon, PencilIcon } from 'lucide-react';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { cn } from '@/lib';
import type { MatchListItem, TeamOwner } from '../api';
import { TeamChip } from './team-chip';

function KnockoutMatchSide({
  teamId,
  name,
  crestUrl,
  owner,
  score,
  muted,
  align,
}: {
  teamId: string;
  name: string;
  crestUrl: string;
  owner: TeamOwner | null;
  score: number | null;
  muted: boolean;
  align?: 'right';
}) {
  return (
    <div className="flex items-center gap-2">
      <TeamChip
        className={cn('flex-1', muted && 'opacity-60')}
        teamId={teamId}
        name={name}
        crestUrl={crestUrl}
        owner={owner}
        align={align}
      />
      <span
        className={cn(
          'shrink-0 font-mono font-bold text-sm tabular-nums',
          muted && 'font-medium text-muted-foreground',
        )}
      >
        {score ?? '–'}
      </span>
    </div>
  );
}

// Card de uma partida de mata-mata — diferente do MatchRow usado na fase de
// grupos: mostra placar maior, destaca o vencedor e carrega o status da
// fase (Encerrado/A definir). Usado tanto no chaveamento (TournamentBracket)
// quanto na aba Jogos a partir das quartas de final.
export function KnockoutMatchCard({
  match,
  isFinal,
  ownerByTeamId,
  onRegisterGoals,
  cardRef,
  cardClassName,
}: {
  match: MatchListItem;
  isFinal?: boolean;
  ownerByTeamId?: Map<string, TeamOwner>;
  onRegisterGoals?: (matchId: string) => void;
  cardRef?: (el: HTMLDivElement | null) => void;
  cardClassName?: string;
}) {
  const played = match.homeScore !== null && match.awayScore !== null;
  const homeWins =
    played && (match.homeScore as number) > (match.awayScore as number);
  const awayWins =
    played && (match.awayScore as number) > (match.homeScore as number);

  return (
    <div
      ref={cardRef}
      className={cn(
        'flex flex-col gap-1.5 rounded-xl border bg-card p-2.5 shadow-sm',
        isFinal && 'border-t-4 border-t-value',
        cardClassName,
      )}
    >
      <KnockoutMatchSide
        teamId={match.homeTeam.id}
        name={match.homeTeam.name}
        crestUrl={match.homeTeam.crestUrl}
        owner={ownerByTeamId?.get(match.homeTeam.id) ?? null}
        score={match.homeScore}
        muted={awayWins}
      />
      <KnockoutMatchSide
        teamId={match.awayTeam.id}
        name={match.awayTeam.name}
        crestUrl={match.awayTeam.crestUrl}
        owner={ownerByTeamId?.get(match.awayTeam.id) ?? null}
        score={match.awayScore}
        muted={homeWins}
        align="right"
      />
      <div className="flex items-center justify-between border-t pt-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
        <span>{isFinal ? 'Decisão' : 'Mata-mata'}</span>
        <div className="flex items-center gap-1.5">
          {played ? (
            <span className="rounded-full bg-success-surface px-2 py-0.5 text-success">
              Encerrado
            </span>
          ) : (
            <span className="rounded-full border px-2 py-0.5">A definir</span>
          )}
          {match.locked ? (
            <Tooltip>
              <TooltipTrigger
                render={<LockIcon className="size-3.5 text-muted-foreground" />}
              />
              <TooltipContent>
                Travada: a próxima fase já foi gerada a partir dela
              </TooltipContent>
            </Tooltip>
          ) : (
            onRegisterGoals && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onRegisterGoals(match.id)}
                    >
                      <PencilIcon className="size-3.5" />
                    </Button>
                  }
                />
                <TooltipContent>Registrar placar</TooltipContent>
              </Tooltip>
            )
          )}
          {match.locked && onRegisterGoals && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRegisterGoals(match.id)}
                  >
                    <EyeIcon className="size-3.5" />
                  </Button>
                }
              />
              <TooltipContent>Ver detalhes</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
