import { useState } from 'react';
import type { TeamWithRatings } from '@/features/admin/teams';
import type { User } from '@/features/admin/users';
import { SelectSeasonSquadsRow } from './select-season-squads-row';

type SelectSeasonSquadsProps = {
  users: User[];
  squads: Map<string, TeamWithRatings>;
  onAssign: (userId: string, team: TeamWithRatings) => void;
  onUnassign: (userId: string) => void;
};

export const SelectSeasonSquads = ({
  users,
  squads,
  onAssign,
  onUnassign,
}: SelectSeasonSquadsProps) => {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const usedTeamIds = new Set(
    Array.from(squads.values()).map((team) => team.id),
  );

  const onToggleExpand = (user: User) =>
    setExpandedUserId(expandedUserId === user.id ? null : user.id);

  const onSelectTeam = (user: User, selected: TeamWithRatings) => {
    onAssign(user.id, selected);
    setExpandedUserId(null);
  };

  return (
    <div className={'flex flex-col gap-2'}>
      {users.map((user) => (
        <SelectSeasonSquadsRow
          key={user.id}
          user={user}
          team={squads.get(user.id)}
          isExpanded={expandedUserId === user.id}
          usedTeamIds={usedTeamIds}
          onToggleExpand={() => onToggleExpand(user)}
          onSelectTeam={(selected) => onSelectTeam(user, selected)}
          onUnassign={() => onUnassign(user.id)}
        />
      ))}
    </div>
  );
};
