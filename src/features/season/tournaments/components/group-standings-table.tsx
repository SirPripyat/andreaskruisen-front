import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import type { StandingWithOwner } from '../api';
import { GoalDiffCell } from './goal-diff-cell';
import { LastResultsCell } from './last-results-cell';
import { TeamChip } from './team-chip';

type GroupStandingsTableProps = {
  standings: StandingWithOwner[];
  showQualifyZone: boolean;
};

const QUALIFY_COUNT = 2;

export const GroupStandingsTable = ({
  standings,
  showQualifyZone,
}: GroupStandingsTableProps) => {
  if (standings.length === 0)
    return (
      <p className="p-4 text-muted-foreground text-sm">
        Nenhum time de usuário neste grupo.
      </p>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">#</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-right">P</TableHead>
          <TableHead className="text-right">J</TableHead>
          <TableHead className="text-right">V</TableHead>
          <TableHead className="text-right">E</TableHead>
          <TableHead className="text-right">D</TableHead>
          <TableHead className="text-right">GP</TableHead>
          <TableHead className="text-right">GC</TableHead>
          <TableHead className="text-right">SG</TableHead>
          <TableHead className="text-right">%</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {standings.map((standing, index) => (
          <TableRow key={standing.teamId}>
            <TableCell className="relative pl-3 text-muted-foreground font-medium">
              {showQualifyZone && index < QUALIFY_COUNT && (
                <span className="absolute inset-y-1 left-0 w-1 rounded-full bg-success" />
              )}
              {standing.position}
            </TableCell>

            <TableCell>
              <TeamChip
                teamId={standing.teamId}
                name={standing.teamName}
                crestUrl={standing.teamCrestUrl}
                owner={standing.owner}
              />
            </TableCell>

            <TableCell className="text-right font-semibold tabular-nums">
              {standing.points}
            </TableCell>

            <TableCell className="text-right tabular-nums">
              {standing.played}
            </TableCell>

            <TableCell className="text-right tabular-nums">
              {standing.wins}
            </TableCell>

            <TableCell className="text-right tabular-nums">
              {standing.draws}
            </TableCell>

            <TableCell className="text-right tabular-nums">
              {standing.losses}
            </TableCell>

            <TableCell className="text-right tabular-nums">
              {standing.goalsFor}
            </TableCell>

            <TableCell className="text-right tabular-nums">
              {standing.goalsAgainst}
            </TableCell>

            <GoalDiffCell value={standing.goalDifference} />

            <TableCell className={'text-right tabular-nums'}>
              {Math.round(standing.winPercentage)}
            </TableCell>

            <LastResultsCell standing={standing} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
