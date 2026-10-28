import { PlusIcon, RefreshCwIcon, XIcon } from 'lucide-react';
import { OverallRatingBadge, TeamCell } from '@/components';
import { Avatar, AvatarFallback, Button } from '@/components/ui';
import type { TeamWithRatings } from '@/features/teams';
import type { User } from '@/features/users';
import { cn, getInitials } from '@/lib';
import { SeasonTeamPicker } from './season-team-picker';

type SelectSeasonSquadsRowProps = {
  user: User;
  team?: TeamWithRatings;
  isExpanded: boolean;
  usedTeamIds: Set<string>;
  onToggleExpand: () => void;
  onSelectTeam: (team: TeamWithRatings) => void;
  onUnassign: () => void;
};

export const SelectSeasonSquadsRow = ({
  user,
  team,
  isExpanded,
  usedTeamIds,
  onToggleExpand,
  onSelectTeam,
  onUnassign,
}: SelectSeasonSquadsRowProps) => {
  return (
    <div className={'flex flex-col gap-2'}>
      <div
        className={cn(
          'flex items-center gap-2 rounded-xl border p-2 text-sm',
          !team && 'border-dashed',
        )}
      >
        <Avatar size={'sm'}>
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>

        <span className={'min-w-0 flex-1 truncate font-medium'}>
          {user.name}
        </span>

        {team ? (
          <div className={'flex min-w-0 items-center gap-2'}>
            <TeamCell crestUrl={team.crestUrl} name={team.name} size={'sm'} />
            <OverallRatingBadge rating={team.averageOverallRating} />
          </div>
        ) : (
          <span className={'text-muted-foreground text-xs'}>Sem time</span>
        )}

        <Button
          type={'button'}
          variant={'outline'}
          size={'sm'}
          onClick={onToggleExpand}
        >
          {team ? <RefreshCwIcon /> : <PlusIcon />}
          {team ? 'Trocar' : 'Atribuir time'}
        </Button>

        {team && (
          <Button
            type={'button'}
            variant={'ghost'}
            size={'icon-sm'}
            onClick={onUnassign}
            aria-label={`Remover time de ${user.name}`}
          >
            <XIcon />
          </Button>
        )}
      </div>

      {isExpanded && (
        <SeasonTeamPicker
          excludeTeamIds={usedTeamIds}
          onSelect={onSelectTeam}
        />
      )}
    </div>
  );
};
