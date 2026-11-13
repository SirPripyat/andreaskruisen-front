import { SearchIcon } from 'lucide-react';
import { Input, SelectOptions, toSelectOptions } from '@/components/ui';
import type { TeamSummary } from '../types';

const ALL_TEAMS = 'all';

type LeadersListProps = {
  search: string;
  setSearch: (value: string) => void;

  teamFilter: string;
  setTeamFilter: (value: string) => void;

  teams: TeamSummary[];
};

export const LeadersList = ({
  search,
  setSearch,
  teamFilter,
  setTeamFilter,
  teams,
}: LeadersListProps) => {
  return (
    <div className={'flex flex-wrap items-center gap-2'}>
      <div className={'relative min-w-45 flex-1'}>
        <SearchIcon
          className={
            'pointer-events-none absolute top-1.5 left-2 size-5 text-muted-foreground'
          }
        />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={'Buscar jogador ou time'}
          className={'pl-8'}
        />
      </div>

      <SelectOptions
        value={teamFilter}
        onValueChange={setTeamFilter}
        options={toSelectOptions(
          { value: ALL_TEAMS, label: 'Todos os times' },
          teams,
          (team) => ({ value: team.id, label: team.name }),
        )}
        triggerClassName={'w-44 shrink-0'}
      />
    </div>
  );
};
