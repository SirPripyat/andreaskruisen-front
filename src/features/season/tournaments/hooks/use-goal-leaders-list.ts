import { useState } from 'react';
import { useDebouncedValue } from '@/hooks';
import type { GoalLeader, TeamSummary } from '../api';

const ALL_TEAMS = 'all';

const getTeams = (leaders: GoalLeader[]) => {
  const map = new Map<string, TeamSummary>();

  for (const leader of leaders) map.set(leader.team.id, leader.team);

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
};

export const useGoalLeadersList = (leaders: GoalLeader[]) => {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>(ALL_TEAMS);

  const debouncedSearch = useDebouncedValue(search, 400);

  const teams = getTeams(leaders);

  const filteredLeaders = leaders.filter((leader) => {
    const matchesTeam =
      teamFilter === ALL_TEAMS || leader.team.id === teamFilter;

    const query = debouncedSearch.trim().toLowerCase();

    const matchesSearch =
      !query ||
      leader.player.name.toLowerCase().includes(query) ||
      leader.team.name.toLowerCase().includes(query);

    return matchesTeam && matchesSearch;
  });

  const podium = leaders.slice(0, 3);

  const leaderCount = leaders[0]?.count || 1;

  return {
    search,
    setSearch,
    teamFilter,
    setTeamFilter,
    teams,
    filteredLeaders,
    podium,
    leaderCount,
  };
};
