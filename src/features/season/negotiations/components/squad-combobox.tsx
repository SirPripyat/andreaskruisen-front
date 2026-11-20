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
import { type SeasonSquad, useSeasonSquads } from '@/features/season/squads';
import { cn } from '@/lib';
import { SquadOption } from './squad-option';

const isSameSquad = (a: SeasonSquad, b: SeasonSquad) => a.id === b.id;

// Negociação direta só pode ter outro participante do outro lado — time de
// CPU não tem Squad, então nem aparece aqui (ver ProposeNegotiationUseCase,
// que rejeita targetTeamId sem Squad com 404).
export const SquadCombobox = ({
  value,
  onValueChange,
  excludeTeamId,
  placeholder = 'Buscar participante...',
}: {
  value: SeasonSquad | null;
  onValueChange: (squad: SeasonSquad | null) => void;
  excludeTeamId?: string;
  placeholder?: string;
}) => {
  const { data: squads, isPending } = useSeasonSquads();
  const options = (squads ?? []).filter(
    (squad) => squad.team.id !== excludeTeamId,
  );

  return (
    <Combobox<SeasonSquad>
      items={options}
      value={value}
      onValueChange={onValueChange}
      isItemEqualToValue={isSameSquad}
      itemToStringLabel={(squad) => `${squad.team.name} ${squad.user.name}`}
      disabled={isPending}
    >
      <ComboboxInputGroup>
        {value && (
          <img
            src={value.team.crestUrl}
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
          {isPending
            ? 'Carregando participantes...'
            : 'Nenhum participante encontrado.'}
        </ComboboxEmpty>
        <ComboboxList>
          {(squad: SeasonSquad) => (
            <ComboboxItem key={squad.id} value={squad}>
              <SquadOption squad={squad} />
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
};
