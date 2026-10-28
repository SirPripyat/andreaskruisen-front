import { EyeIcon, LockIcon, PencilIcon } from 'lucide-react';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import type { MatchListItem, TeamOwner } from '../api';
import { TeamChip } from './team-chip';

export function MatchRow({
  match,
  homeOwner,
  awayOwner,
  compact,
  onRegisterGoals,
}: {
  match: MatchListItem;
  homeOwner?: TeamOwner | null;
  awayOwner?: TeamOwner | null;
  compact?: boolean;
  onRegisterGoals?: (matchId: string) => void;
}) {
  const played = match.homeScore !== null && match.awayScore !== null;

  return (
    <div className="flex items-center gap-2 rounded-xl border p-2 text-sm transition-colors hover:bg-muted/30">
      <TeamChip
        className="flex-1"
        teamId={match.homeTeam.id}
        name={match.homeTeam.name}
        crestUrl={match.homeTeam.crestUrl}
        owner={homeOwner ?? null}
        compact={compact}
      />
      {played ? (
        <span className="shrink-0 font-mono font-semibold text-sm tabular-nums">
          {match.homeScore} - {match.awayScore}
        </span>
      ) : (
        <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          A definir
        </span>
      )}
      <TeamChip
        className="flex-1"
        teamId={match.awayTeam.id}
        name={match.awayTeam.name}
        crestUrl={match.awayTeam.crestUrl}
        owner={awayOwner ?? null}
        align="right"
        compact={compact}
      />
      {match.locked ? (
        <>
          <Tooltip>
            <TooltipTrigger
              render={
                <LockIcon className="size-3.5 shrink-0 text-muted-foreground" />
              }
            />
            <TooltipContent>
              Travada: a próxima fase já foi gerada a partir dela
            </TooltipContent>
          </Tooltip>
          {onRegisterGoals && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0"
                    onClick={() => onRegisterGoals(match.id)}
                  >
                    <EyeIcon className="size-3.5" />
                  </Button>
                }
              />
              <TooltipContent>Ver detalhes</TooltipContent>
            </Tooltip>
          )}
        </>
      ) : (
        onRegisterGoals && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0"
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
    </div>
  );
}
