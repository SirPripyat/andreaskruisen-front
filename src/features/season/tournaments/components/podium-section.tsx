import type { GoalLeader } from '../api';
import { PodiumCard } from './podium-card';

type PodiumSectionProps = {
  podium: GoalLeader[];
  countLabel: string;
};

export const PodiumSection = ({ podium, countLabel }: PodiumSectionProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-3 sm:items-end">
      {podium.map((leader, index) => (
        <PodiumCard
          key={leader.player.id}
          leader={leader}
          index={index}
          countLabel={countLabel}
        />
      ))}
    </div>
  );
};
