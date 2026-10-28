import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { cn } from '@/lib';
import type { StandingWithOwner } from '../api';
import { TeamChip } from './team-chip';

// Quantas posições de cada grupo avançam para o mata-mata. A API não expõe
// essa regra hoje, então assumimos o padrão de 2 classificados por grupo.
const QUALIFY_COUNT = 2;

const RESULT_LABEL: Record<'W' | 'D' | 'L', string> = {
  W: 'V',
  D: 'E',
  L: 'D',
};

const RESULT_CLASS: Record<'W' | 'D' | 'L', string> = {
  W: 'bg-success',
  D: 'bg-muted-foreground',
  L: 'bg-destructive',
};

function GoalDifferenceCell({ value }: { value: number }) {
  return (
    <TableCell
      className={cn(
        'text-right font-medium tabular-nums',
        value > 0 && 'text-success',
        value < 0 && 'text-destructive',
      )}
    >
      {value > 0 ? `+${value}` : value}
    </TableCell>
  );
}

function GroupStandingsTable({
  standings,
  crestByTeamId,
  showQualifyZone,
}: {
  standings: StandingWithOwner[];
  crestByTeamId: Map<string, string>;
  showQualifyZone: boolean;
}) {
  if (standings.length === 0) {
    return (
      <p className="p-4 text-muted-foreground text-sm">
        Nenhum time de usuário neste grupo.
      </p>
    );
  }

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
          <TableHead className="text-right">Forma</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {standings.map((standing, index) => {
          const qualifies = showQualifyZone && index < QUALIFY_COUNT;
          return (
            <TableRow key={standing.teamId}>
              <TableCell className="relative pl-3 text-muted-foreground font-medium">
                {qualifies && (
                  <span className="absolute inset-y-1 left-0 w-1 rounded-full bg-success" />
                )}
                {standing.position}
              </TableCell>
              <TableCell>
                <TeamChip
                  teamId={standing.teamId}
                  name={standing.teamName}
                  crestUrl={crestByTeamId.get(standing.teamId)}
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
              <GoalDifferenceCell value={standing.goalDifference} />
              <TableCell>
                {standing.last5.length === 0 ? (
                  <span className="block text-right text-muted-foreground">
                    -
                  </span>
                ) : (
                  <div className="flex justify-end gap-1">
                    {standing.last5.map((result, resultIndex) => (
                      <span
                        // biome-ignore lint/suspicious/noArrayIndexKey: last5 is a fixed, fully-replaced list with no stable id
                        key={resultIndex}
                        className={cn(
                          'flex size-4 items-center justify-center rounded-full font-semibold text-[9px] text-white',
                          RESULT_CLASS[result],
                        )}
                      >
                        {RESULT_LABEL[result]}
                      </span>
                    ))}
                  </div>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function TournamentGroupStandings({
  groups,
  crestByTeamId,
  showQualifyZone = false,
  filters,
}: {
  groups: Record<string, StandingWithOwner[]>;
  crestByTeamId: Map<string, string>;
  showQualifyZone?: boolean;
  filters?: React.ReactNode;
}) {
  const entries = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));

  if (entries.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm">
        Nenhuma fase de grupos ativa neste torneio.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-muted-foreground text-xs uppercase">
          Classificação final · fase de grupos
        </span>
        {filters}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {entries.map(([groupLabel, standings]) => (
          <div
            key={groupLabel}
            className="w-full overflow-hidden rounded-xl border bg-card"
          >
            <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-4 py-3">
              <span className="font-display font-bold text-base uppercase">
                Grupo {groupLabel}
              </span>
              <Badge variant="outline">{standings.length} times</Badge>
            </div>
            <div className="overflow-x-auto p-4">
              <GroupStandingsTable
                standings={standings}
                crestByTeamId={crestByTeamId}
                showQualifyZone={showQualifyZone}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
