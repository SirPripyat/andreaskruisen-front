import type { GoalLeader } from '../api';
import { useGoalLeadersList } from '../hooks';
import { LeadersList } from './leaders-list';
import { LeadersTable } from './leaders-table';
import { PodiumSection } from './podium-section';

type GoalLeadersListProps = {
  leaders: GoalLeader[];
  countLabel: string;
};

export const GoalLeadersList = ({
  leaders,
  countLabel,
}: GoalLeadersListProps) => {
  const {
    search,
    setSearch,
    teamFilter,
    setTeamFilter,
    teams,
    filteredLeaders,
    podium,
    leaderCount,
  } = useGoalLeadersList(leaders);

  return (
    <div className={'flex flex-col gap-6'}>
      <PodiumSection podium={podium} countLabel={countLabel} />

      <div className="flex flex-col gap-3">
        <LeadersList
          search={search}
          setSearch={setSearch}
          teamFilter={teamFilter}
          setTeamFilter={setTeamFilter}
          teams={teams}
        />

        <LeadersTable
          countLabel={countLabel}
          filtered={filteredLeaders}
          leaderCount={leaderCount}
          leaders={leaders}
        />
      </div>
    </div>
  );
};
