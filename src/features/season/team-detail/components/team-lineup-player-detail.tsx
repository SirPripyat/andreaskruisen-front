import { XIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage, Badge } from '@/components/ui';
import type { RosterPlayer } from '@/features/season/squads';
import {
  cn,
  getInitials,
  getOverallRatingClassName,
  getPositionGroup,
  getPositionGroupClassName,
  getPositionGroupLabel,
} from '@/lib';

const FOOT_LABELS: Record<RosterPlayer['preferredFoot'], string> = {
  LEFT: 'Esquerdo',
  RIGHT: 'Destro',
};

export const TeamLineupPlayerDetail = ({
  player,
  starters,
  onClose,
}: {
  player: RosterPlayer;
  starters: RosterPlayer[];
  onClose: () => void;
}) => {
  const group = getPositionGroup(player.position);
  const lineMates = starters.filter(
    (teammate) => getPositionGroup(teammate.position) === group,
  );
  const lineAverage = lineMates.length
    ? lineMates.reduce((sum, teammate) => sum + teammate.overallRating, 0) /
      lineMates.length
    : player.overallRating;
  const diff = Math.round(player.overallRating - lineAverage);
  const isStarter = starters.some((teammate) => teammate.id === player.id);

  return (
    <div className={'flex items-center gap-3 rounded-xl border bg-card p-3'}>
      <Avatar className={'size-12'}>
        <AvatarImage src={player.photoUrl} alt={player.name} />
        <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
      </Avatar>

      <div className={'flex min-w-0 flex-1 flex-col gap-0.5'}>
        <div className={'flex flex-wrap items-center gap-2'}>
          <span className={'font-semibold text-sm'}>{player.name}</span>
          <Badge
            variant={'outline'}
            className={getOverallRatingClassName(
              Math.round(player.overallRating),
            )}
          >
            {Math.round(player.overallRating)}
          </Badge>
        </div>
        <div
          className={
            'flex flex-wrap items-center gap-x-3 gap-y-0.5 text-muted-foreground text-xs'
          }
        >
          <span
            className={cn(
              'rounded px-1 font-mono',
              getPositionGroupClassName(player.position),
            )}
          >
            {player.position}
          </span>
          <span>{getPositionGroupLabel(group)}</span>
          <span className={'flex items-center gap-1'}>
            <img
              src={player.nationality.flagUrl}
              alt={''}
              className={'h-3 w-4 rounded-[1px] object-cover'}
            />
            {player.nationality.name}
          </span>
          <span>Pé {FOOT_LABELS[player.preferredFoot].toLowerCase()}</span>
          <span>{isStarter ? 'Titular' : 'Reserva'}</span>
          {lineMates.length > 1 && (
            <span>
              {diff === 0
                ? 'Na média da linha'
                : `${diff > 0 ? '+' : ''}${diff} vs. média da linha (${Math.round(lineAverage)})`}
            </span>
          )}
        </div>
      </div>

      <button
        type={'button'}
        onClick={onClose}
        aria-label={'Fechar detalhes do jogador'}
        className={
          'shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground'
        }
      >
        <XIcon className={'size-4'} />
      </button>
    </div>
  );
};
