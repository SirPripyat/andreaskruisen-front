import { useState } from 'react';
import { SearchInput } from '@/components';
import type { RosterBySector } from '@/features/season/squads';
import { cn, getPositionGroup } from '@/lib';
import { PlayerOption } from '@/shared/features/transfers';

const POSITION_FILTERS = ['ALL', 'GOL', 'DEF', 'MID', 'ATT'] as const;
type PositionFilterValue = (typeof POSITION_FILTERS)[number];

const POSITION_FILTER_LABELS: Record<PositionFilterValue, string> = {
  ALL: 'Todos',
  GOL: 'GOL',
  DEF: 'DEF',
  MID: 'MEI',
  ATT: 'ATA',
};

const SECTORS: (keyof RosterBySector)[] = [
  'goalkeepers',
  'defenders',
  'midfielders',
  'attackers',
];

type PlayerPickerListProps = {
  roster: RosterBySector | undefined;
  isRosterPending: boolean;
  hasTeam: boolean;
  noTeamMessage: string;
  selectedIds: string[];
  onSelect: (playerId: string) => void;
};

export const PlayerPickerList = ({
  roster,
  isRosterPending,
  hasTeam,
  noTeamMessage,
  selectedIds,
  onSelect,
}: PlayerPickerListProps) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<PositionFilterValue>('ALL');

  if (!hasTeam) {
    return (
      <div
        className={
          'rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm'
        }
      >
        {noTeamMessage}
      </div>
    );
  }

  if (isRosterPending) {
    return (
      <div className={'p-6 text-center text-muted-foreground text-sm'}>
        {'Carregando elenco...'}
      </div>
    );
  }

  const players = SECTORS.flatMap((sector) => roster?.[sector] ?? []);
  const filtered = players.filter((player) => {
    const groupOk =
      filter === 'ALL' || getPositionGroup(player.position) === filter;
    const searchOk =
      !search || player.name.toLowerCase().includes(search.toLowerCase());
    return groupOk && searchOk;
  });

  return (
    <div className={'flex flex-col gap-3'}>
      <div className={'flex gap-1 overflow-x-auto pb-0.5'}>
        {POSITION_FILTERS.map((value) => (
          <button
            key={value}
            type={'button'}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={cn(
              'shrink-0 rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold',
              filter === value
                ? 'border-foreground bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted/40',
            )}
          >
            {POSITION_FILTER_LABELS[value]}
          </button>
        ))}
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={'Buscar jogador...'}
        className={'max-w-none'}
      />

      {filtered.length === 0 ? (
        <div
          className={
            'rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm'
          }
        >
          {'Nenhum jogador encontrado.'}
        </div>
      ) : (
        <div className={'flex flex-col gap-1.5'}>
          {filtered.map((player) => (
            <PlayerOption
              key={player.id}
              player={player}
              selected={selectedIds.includes(player.id)}
              onSelect={() => onSelect(player.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
