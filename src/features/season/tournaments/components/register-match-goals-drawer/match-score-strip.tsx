import type { MatchDetail } from '../../api';
import { TeamChip } from '../team-chip';

export const MatchScoreStrip = ({
  match,
  homeGoals,
  awayGoals,
}: {
  match: MatchDetail;
  homeGoals: number;
  awayGoals: number;
}) => (
  <div className="flex items-center justify-center gap-4 border-b border-dashed pb-5">
    <TeamChip
      className="flex-1"
      name={match.homeTeam.name}
      crestUrl={match.homeTeam.crestUrl}
    />
    <div className="flex shrink-0 items-center gap-2 font-mono font-bold text-3xl tabular-nums">
      <span className="text-accent">{homeGoals}</span>
      <span className="text-muted-foreground text-xl">–</span>
      <span>{awayGoals}</span>
    </div>
    <TeamChip
      className="flex-1"
      name={match.awayTeam.name}
      crestUrl={match.awayTeam.crestUrl}
      align="right"
    />
  </div>
);
