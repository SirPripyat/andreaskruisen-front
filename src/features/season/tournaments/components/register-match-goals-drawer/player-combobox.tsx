import { useMemo } from 'react';
import {
  Combobox,
  ComboboxClear,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
} from '@/components/ui';
import { cn } from '@/lib';
import type { MatchPlayerOption } from '../../api';
import { PlayerAvatar } from './player-avatar';

const POSITION_GROUPS: { label: string; positions: string[] }[] = [
  { label: 'Atacante', positions: ['ATA', 'PD', 'PE'] },
  { label: 'Meio-campo', positions: ['VOL', 'MC', 'MD', 'ME', 'MEI'] },
  { label: 'Defesa', positions: ['ZAG', 'LD', 'LE'] },
  { label: 'Goleiro', positions: ['GOL'] },
];

type PlayerGroup = { label: string; items: MatchPlayerOption[] };

const groupPlayersByPosition = (players: MatchPlayerOption[]): PlayerGroup[] =>
  POSITION_GROUPS.map((group) => ({
    label: group.label,
    items: players.filter((player) =>
      group.positions.includes(player.position),
    ),
  })).filter((group) => group.items.length > 0);

const isSamePlayer = (a: MatchPlayerOption, b: MatchPlayerOption) =>
  a.id === b.id;

const filterPlayer = (player: MatchPlayerOption, query: string) =>
  player.name.toLowerCase().includes(query.toLowerCase());

type PlayerComboboxProps = {
  players: MatchPlayerOption[];
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
};

export const PlayerCombobox = ({
  players,
  value,
  onValueChange,
  onBlur,
  placeholder = 'Selecione',
  disabled,
}: PlayerComboboxProps) => {
  const groups = useMemo(() => groupPlayersByPosition(players), [players]);
  const selectedPlayer = players.find((player) => player.id === value) ?? null;

  return (
    <Combobox<MatchPlayerOption>
      items={groups}
      value={selectedPlayer}
      onValueChange={(player) => onValueChange(player?.id ?? '')}
      isItemEqualToValue={isSamePlayer}
      itemToStringLabel={(player) => player.name}
      filter={filterPlayer}
      disabled={disabled}
    >
      <ComboboxInputGroup>
        {selectedPlayer && (
          <PlayerAvatar
            player={selectedPlayer}
            className="absolute left-1.5 top-1/2 -translate-y-1/2"
          />
        )}
        <ComboboxInput
          placeholder={placeholder}
          onBlur={onBlur}
          className={cn(selectedPlayer && 'pl-8')}
        />
        <ComboboxClear aria-label="Limpar seleção" />
        <ComboboxTrigger />
      </ComboboxInputGroup>

      <ComboboxPopup>
        <ComboboxEmpty>Nenhum jogador encontrado.</ComboboxEmpty>
        <ComboboxList>
          {(group: PlayerGroup) => (
            <ComboboxGroup key={group.label} items={group.items}>
              <ComboboxGroupLabel>{group.label}</ComboboxGroupLabel>
              <ComboboxCollection>
                {(player: MatchPlayerOption) => (
                  <ComboboxItem key={player.id} value={player}>
                    <PlayerAvatar player={player} />
                    <span className="truncate">{player.name}</span>
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
};
