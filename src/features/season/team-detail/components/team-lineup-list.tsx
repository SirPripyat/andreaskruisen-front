import { Fragment } from 'react';
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
import type { RosterPlayer } from '@/features/season/squads';
import {
  cn,
  getOverallRatingClassName,
  getPositionGroupClassName,
} from '@/lib';

const POSITION_GROUPS: { label: string; positions: string[] }[] = [
  { label: 'Atacantes', positions: ['ATA', 'PD', 'PE'] },
  { label: 'Meio-campistas', positions: ['VOL', 'MC', 'MD', 'ME', 'MEI'] },
  { label: 'Defensores', positions: ['ZAG', 'LD', 'LE'] },
  { label: 'Goleiros', positions: ['GOL'] },
];

const FOOT_LABELS: Record<RosterPlayer['preferredFoot'], string> = {
  LEFT: 'Esquerdo',
  RIGHT: 'Destro',
};

const SKELETON_ROW_KEYS = Array.from(
  { length: 6 },
  (_, index) => `lineup-list-skeleton-${index}`,
);

const getGroups = (starters: RosterPlayer[]) => {
  return POSITION_GROUPS.map((group) => ({
    label: group.label,
    players: starters
      .filter((player) => group.positions.includes(player.position))
      .sort((a, b) => b.overallRating - a.overallRating),
  })).filter((group) => group.players.length > 0);
};

type TeamLineupListProps = {
  starters: RosterPlayer[];
  isPending: boolean;
  selectedId: string | null;
  onSelect: (playerId: string) => void;
};

export const TeamLineupList = ({
  starters,
  isPending,
  selectedId,
  onSelect,
}: TeamLineupListProps) => {
  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        {SKELETON_ROW_KEYS.map((key) => (
          <Skeleton key={key} className="h-9 w-full" />
        ))}
      </div>
    );
  }

  const groups = getGroups(starters);

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jogador</TableHead>
            <TableHead>Posição</TableHead>
            <TableHead>Nação</TableHead>
            <TableHead>Pé</TableHead>
            <TableHead className="text-right">Overall</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {groups.map((group) => (
            <Fragment key={group.label}>
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="bg-muted/40 py-1.5 font-mono text-[11px] text-muted-foreground uppercase tracking-wide"
                >
                  {group.label}
                </TableCell>
              </TableRow>

              {group.players.map((player) => (
                <TableRow
                  key={player.id}
                  className={cn(
                    'cursor-pointer',
                    selectedId === player.id && 'bg-muted/50',
                  )}
                  onClick={() => onSelect(player.id)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarImage src={player.photoUrl} alt="" />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {player.name}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 font-mono text-xs',
                        getPositionGroupClassName(player.position),
                      )}
                    >
                      {player.position}
                    </span>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {player.nationality.name}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {FOOT_LABELS[player.preferredFoot]}
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
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
