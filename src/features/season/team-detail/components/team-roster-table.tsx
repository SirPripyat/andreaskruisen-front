import { Fragment } from 'react';
import { Link, useParams } from 'react-router';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import {
  type RosterBySector,
  type RosterPlayer,
  useRoster,
} from '@/features/season/squads';
import { useIsMobile } from '@/hooks';
import {
  calculateAge,
  getOverallRatingClassName,
  getPositionGroupClassName,
} from '@/lib';
import { ActionCell } from '@/shared/features/players';
import { FOOT_LABELS, SECTOR_GROUPS } from './team-roster-constants';
import { TeamRosterMobileList } from './team-roster-mobile-list';

const SKELETON_ROW_KEYS = Array.from(
  { length: 6 },
  (_, index) => `roster-skeleton-${index}`,
);

export const TeamRosterTable = () => {
  const { id } = useParams<{ id: string }>();
  const { data: roster, isPending } = useRoster(id);
  const isMobile = useIsMobile();

  if (!roster) return null;

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        {SKELETON_ROW_KEYS.map((key) => (
          <Skeleton key={key} className="h-9 w-full" />
        ))}
      </div>
    );
  }

  const playersRoster = Object.entries(roster) as [
    keyof RosterBySector,
    RosterPlayer[],
  ][];

  if (playersRoster.length === 0) {
    return (
      <p className="p-4 text-center text-muted-foreground text-sm">
        Nenhum jogador vinculado a este time nesta temporada.
      </p>
    );
  }

  if (isMobile) return <TeamRosterMobileList playersRoster={playersRoster} />;

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={'w-8 pl-4'}>#</TableHead>
            <TableHead>Jogador</TableHead>
            <TableHead className="text-right">Overall</TableHead>
            <TableHead>Posição</TableHead>
            <TableHead>Pé</TableHead>
            <TableHead>Nação</TableHead>
            <TableHead>Idade</TableHead>
            <TableHead>Titular</TableHead>
            <TableHead className={'w-8'} />
          </TableRow>
        </TableHeader>

        <TableBody>
          {playersRoster.map(([group, players]) => (
            <Fragment key={group}>
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={9}
                  className="bg-muted/40 py-1.5 font-mono text-[11px] text-muted-foreground uppercase tracking-wide"
                >
                  {SECTOR_GROUPS[group]}
                </TableCell>
              </TableRow>

              {players.map((player, index) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium text-xs text-muted-foreground w-8 pl-4">
                    {index + 1}
                  </TableCell>

                  <TableCell className="font-medium">
                    <Link
                      to={`/players/${player.id}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <Avatar>
                        <AvatarImage src={player.photoUrl} alt="" />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {player.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={getOverallRatingClassName(
                        Math.round(player.overallRating),
                      )}
                    >
                      {Math.round(player.overallRating)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-1.5 py-0.5 font-mono text-xs ${getPositionGroupClassName(player.position)}`}
                    >
                      {player.position}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {FOOT_LABELS[player.preferredFoot]}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={player.nationality.flagUrl}
                        alt={player.nationality.name}
                        className="size-3.5 rounded-full object-cover"
                      />
                      {player.nationality.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {calculateAge(player.birthdate)}
                  </TableCell>
                  <TableCell>
                    {player.isStarter ? (
                      <span className="inline-flex items-center gap-1.5 text-success text-xs">
                        <span className="size-1.5 rounded-full bg-success" />
                        Titular
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <ActionCell id={player.id} />
                  </TableCell>
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
