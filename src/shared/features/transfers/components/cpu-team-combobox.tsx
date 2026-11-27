import { useState } from 'react';
import {
  Combobox,
  ComboboxClear,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
} from '@/components/ui';
import type { TeamWithRatings } from '@/features/admin/teams';
import { useClubs } from '@/features/season/clubs';
import { useSeasonSquads } from '@/features/season/squads';
import { useDebouncedValue } from '@/hooks';
import { cn } from '@/lib';
import { TeamOption } from './team-option';

const PAGE_SIZE = 20;

const isSameTeam = (a: TeamWithRatings, b: TeamWithRatings) => a.id === b.id;

// Time de CPU = time sem Squad na temporada selecionada — o inverso do
// SquadCombobox. Trocar com CPU é instantâneo (não tem técnico pra aceitar
// proposta), por isso só times sem Squad aparecem aqui.
export const CpuTeamCombobox = ({
  value,
  onValueChange,
  placeholder = 'Buscar time de CPU...',
}: {
  value: TeamWithRatings | null;
  onValueChange: (team: TeamWithRatings | null) => void;
  placeholder?: string;
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data: squads } = useSeasonSquads();
  const ownedTeamIds = new Set((squads ?? []).map((squad) => squad.team.id));

  const { data, isPending } = useClubs({
    name: debouncedQuery || undefined,
    page: 1,
    pageSize: PAGE_SIZE,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const teams = (data?.data ?? []).filter((team) => !ownedTeamIds.has(team.id));

  return (
    <Combobox<TeamWithRatings>
      items={teams}
      value={value}
      onValueChange={onValueChange}
      onInputValueChange={setQuery}
      isItemEqualToValue={isSameTeam}
      itemToStringLabel={(team) => team.name}
      filter={null}
    >
      <ComboboxInputGroup>
        {value && (
          <img
            src={value.crestUrl}
            alt={''}
            className={
              'absolute top-1/2 left-1.5 size-4 shrink-0 -translate-y-1/2 object-contain'
            }
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden';
            }}
          />
        )}
        <ComboboxInput
          placeholder={placeholder}
          className={cn(value && 'pl-7')}
        />
        <ComboboxClear aria-label={'Limpar seleção'} />
        <ComboboxTrigger />
      </ComboboxInputGroup>

      <ComboboxPopup>
        <ComboboxEmpty>
          {isPending ? 'Buscando times...' : 'Nenhum time de CPU encontrado.'}
        </ComboboxEmpty>
        <ComboboxList>
          {(team: TeamWithRatings) => (
            <ComboboxItem key={team.id} value={team}>
              <TeamOption team={team} />
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
};
