import { SearchIcon } from 'lucide-react';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import type { TeamSummary } from '../api';

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

      <Select
        value={teamFilter}
        onValueChange={(value) => setTeamFilter(value as string)}
        items={{
          [ALL_TEAMS]: 'Todos os times',
          ...Object.fromEntries(teams.map((team) => [team.id, team.name])),
        }}
      >
        <SelectTrigger className={'w-44 shrink-0'}>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={ALL_TEAMS}>Todos os times</SelectItem>

          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
