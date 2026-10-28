import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { cn } from '@/lib';
import type { GoalLeader } from '../api';

const PODIUM_STYLES = [
  { border: 'border-t-value', badge: 'bg-value' },
  { border: 'border-t-border-strong', badge: 'bg-muted-foreground' },
  { border: 'border-t-warning', badge: 'bg-warning' },
];

export function GoalLeadersList({
  leaders,
  countLabel,
  emptyMessage,
}: {
  leaders: GoalLeader[];
  countLabel: string;
  emptyMessage: string;
}) {
  if (leaders.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm">
        {emptyMessage}
      </p>
    );
  }

  const podium = leaders.slice(0, 3);
  const rest = leaders.slice(3);
  const leaderCount = leaders[0].count || 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {podium.map((leader, index) => (
          <div
            key={leader.player.id}
            className={cn(
              'relative flex flex-col items-center gap-2 rounded-xl border-t-4 bg-card p-4 text-center',
              PODIUM_STYLES[index].border,
            )}
          >
            <span
              className={cn(
                'absolute -top-3 -left-3 flex size-7 items-center justify-center rounded-full font-display font-bold text-white text-xs',
                PODIUM_STYLES[index].badge,
              )}
            >
              {index + 1}
            </span>
            <Avatar size="lg">
              <AvatarImage src={leader.player.photoUrl} alt="" />
              <AvatarFallback>{leader.player.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium text-sm">
                {leader.player.name}
              </span>
              <span className="truncate text-muted-foreground text-xs">
                {leader.team.name}
              </span>
            </div>
            <span className="font-display font-extrabold text-2xl text-accent">
              {leader.count}
              <span className="ml-1 font-sans font-semibold text-muted-foreground text-xs">
                {countLabel}
              </span>
            </span>
          </div>
        ))}
      </div>

      {rest.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {rest.map((leader, index) => (
            <div
              key={leader.player.id}
              className="flex items-center gap-3 rounded-lg border p-2 text-sm"
            >
              <span className="w-5 shrink-0 text-center text-muted-foreground">
                {index + 4}
              </span>
              <Avatar size="sm">
                <AvatarImage src={leader.player.photoUrl} alt="" />
                <AvatarFallback>{leader.player.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium">
                  {leader.player.name}
                </span>
                <span className="truncate text-muted-foreground text-xs">
                  {leader.team.name}
                </span>
              </div>
              <div className="flex w-28 shrink-0 flex-col items-end gap-1">
                <span className="font-semibold">
                  {leader.count} {countLabel}
                </span>
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{
                      width: `${Math.round((leader.count / leaderCount) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
