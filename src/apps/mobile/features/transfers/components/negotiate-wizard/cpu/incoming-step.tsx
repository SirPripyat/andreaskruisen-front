import { useState } from 'react';
import { SearchInput } from '@/components';
import { Button } from '@/components/ui';
import { useClubs } from '@/features/season/clubs';
import { useSeasonSquads } from '@/features/season/squads';
import { useDebouncedValue } from '@/hooks';
import { PlayerPickerList } from '../player-picker-list';
import { TeamSearchCard } from '../team-search-card';
import { togglePlayerId } from '../toggle-player-id';
import type { useCpuTransferWizard } from './use-cpu-transfer-wizard';

const PAGE_SIZE = 20;

type IncomingStepProps = {
  wizard: ReturnType<typeof useCpuTransferWizard>;
};

// Time de CPU = time sem Squad na temporada (mesmo critério do
// CpuTeamCombobox no desktop) — trocar com ele é instantâneo.
export const IncomingStep = ({ wizard }: IncomingStepProps) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const {
    incomingTeam,
    selectIncomingTeam,
    incomingRoster,
    isIncomingRosterPending,
    incomingPlayerIds,
    setValue,
    isIncomingLocked,
  } = wizard;

  const { data: squads } = useSeasonSquads();
  const ownedTeamIds = new Set((squads ?? []).map((squad) => squad.team.id));

  const { data, isPending } = useClubs({
    name: debouncedSearch || undefined,
    page: 1,
    pageSize: PAGE_SIZE,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const teams = (data?.data ?? []).filter((team) => !ownedTeamIds.has(team.id));

  if (incomingTeam) {
    return (
      <div className={'flex flex-col gap-3'}>
        {isIncomingLocked && (
          <p className={'text-muted-foreground text-xs'}>
            {'Time de CPU definido a partir do jogador escolhido.'}
          </p>
        )}

        <TeamSearchCard
          name={incomingTeam.name}
          crestUrl={incomingTeam.crestUrl}
          subtitle={incomingTeam.league.name}
          overall={incomingTeam.averageOverallRating ?? undefined}
          selected
          onSelect={() => {}}
        />

        {!isIncomingLocked && (
          <Button
            type={'button'}
            variant={'ghost'}
            size={'sm'}
            className={'self-start underline'}
            onClick={() => selectIncomingTeam(null)}
          >
            {'Trocar time'}
          </Button>
        )}

        <PlayerPickerList
          roster={incomingRoster}
          isRosterPending={isIncomingRosterPending}
          hasTeam
          noTeamMessage={''}
          selectedIds={incomingPlayerIds}
          onSelect={(playerId) =>
            !isIncomingLocked &&
            setValue(
              'incomingPlayerIds',
              togglePlayerId(incomingPlayerIds, playerId),
            )
          }
        />
      </div>
    );
  }

  return (
    <div className={'flex flex-col gap-3'}>
      <p className={'text-muted-foreground text-xs'}>
        {
          'Times de CPU não têm técnico pra aceitar propostas — a troca acontece na hora, pelo valor de mercado.'
        }
      </p>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={'Buscar time de CPU...'}
        className={'max-w-none'}
      />

      {isPending ? (
        <div className={'p-6 text-center text-muted-foreground text-sm'}>
          {'Buscando times...'}
        </div>
      ) : teams.length === 0 ? (
        <div
          className={
            'rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm'
          }
        >
          {'Nenhum time de CPU encontrado.'}
        </div>
      ) : (
        <div className={'flex flex-col gap-2'}>
          {teams.map((team) => (
            <TeamSearchCard
              key={team.id}
              name={team.name}
              crestUrl={team.crestUrl}
              subtitle={team.league.name}
              overall={team.averageOverallRating ?? undefined}
              selected={false}
              onSelect={() => selectIncomingTeam(team)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
