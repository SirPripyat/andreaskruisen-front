import { useState } from 'react';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage, Badge } from '@/components/ui';
import type { RosterBySector, RosterPlayer } from '@/features/season/squads';
import {
  calculateAge,
  cn,
  getOverallRatingClassName,
  getPositionGroupClassName,
} from '@/lib';
import { ActionCell } from '@/shared/features/players';
import { FOOT_LABELS, SECTOR_GROUPS } from './team-roster-constants';

const SECTOR_FILTERS = [
  'all',
  'goalkeepers',
  'defenders',
  'midfielders',
  'attackers',
] as const;

type SectorFilter = (typeof SECTOR_FILTERS)[number];

const SECTOR_FILTER_LABELS: Record<SectorFilter, string> = {
  all: 'Todos',
  ...SECTOR_GROUPS,
};

type TeamRosterMobileListProps = {
  playersRoster: [keyof RosterBySector, RosterPlayer[]][];
};

export const TeamRosterMobileList = ({
  playersRoster,
}: TeamRosterMobileListProps) => {
  const [filter, setFilter] = useState<SectorFilter>('all');

  const visibleRoster = playersRoster.filter(
    ([group]) => filter === 'all' || group === filter,
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 overflow-x-auto pb-0.5">
        {SECTOR_FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={cn(
              'shrink-0 rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold',
              filter === value
                ? 'border-foreground bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted/40',
            )}
          >
            {SECTOR_FILTER_LABELS[value]}
          </button>
        ))}
      </div>

      {visibleRoster.map(([group, players]) => (
        <div key={group} className="flex flex-col">
          <div className="rounded-md bg-muted/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
            {SECTOR_GROUPS[group]}
          </div>

          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-3 border-b px-1 py-2.5 last:border-b-0"
            >
              <Link
                to={`/players/${player.id}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <Avatar>
                  <AvatarImage src={player.photoUrl} alt="" />
                  <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm">{player.name}</p>

                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span
                      className={`rounded-full px-1.5 py-0.5 font-mono ${getPositionGroupClassName(player.position)}`}
                    >
                      {player.position}
                    </span>
                    <span>{FOOT_LABELS[player.preferredFoot]}</span>
                    <span className="flex items-center gap-1">
                      <img
                        src={player.nationality.flagUrl}
                        alt={player.nationality.name}
                        className="size-3 rounded-full object-cover"
                      />
                      {player.nationality.name}
                    </span>
                    <span>{calculateAge(player.birthdate)} anos</span>
                    {player.isStarter ? (
                      <span className="flex items-center gap-1 text-success">
                        <span className="size-1.5 rounded-full bg-success" />
                        Titular
                      </span>
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                </div>
              </Link>

              <Badge
                variant="outline"
                className={getOverallRatingClassName(
                  Math.round(player.overallRating),
                )}
              >
                {Math.round(player.overallRating)}
              </Badge>

              <ActionCell id={player.id} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
