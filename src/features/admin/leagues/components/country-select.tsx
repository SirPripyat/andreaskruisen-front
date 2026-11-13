import { XIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
} from '@/components/ui';
import {
  type Nationality,
  useNationalities,
} from '@/features/admin/nationalities';
import { useDebouncedValue } from '@/hooks';
import { cn } from '@/lib';

const PAGE_SIZE = 20;

const isSameCountry = (a: Nationality, b: Nationality) => a.id === b.id;

type CountrySelectProps = {
  value: Nationality | null;
  onValueChange: (country: Nationality | null) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const CountrySelect = ({
  value,
  onValueChange,
  placeholder = 'Buscar país...',
  disabled,
}: CountrySelectProps) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data, isPending } = useNationalities({
    name: debouncedQuery || undefined,
    page: 1,
    pageSize: PAGE_SIZE,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const countries = data?.data ?? [];

  return (
    <Combobox<Nationality>
      items={countries}
      value={value}
      onValueChange={onValueChange}
      onInputValueChange={(nextQuery, eventDetails) => {
        if (eventDetails.reason === 'input-change') setQuery(nextQuery);
      }}
      isItemEqualToValue={isSameCountry}
      itemToStringLabel={(country) => country.name}
      filter={null}
      disabled={disabled}
    >
      <ComboboxInputGroup>
        {value && (
          <img
            src={value.flagUrl}
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
        {value && (
          <button
            type={'button'}
            aria-label={'Limpar seleção'}
            onClick={() => onValueChange(null)}
            className={
              'flex h-full shrink-0 items-center justify-center px-1.5 text-muted-foreground hover:text-foreground'
            }
          >
            <XIcon className={'size-4'} />
          </button>
        )}
        <ComboboxTrigger />
      </ComboboxInputGroup>

      <ComboboxPopup>
        <ComboboxEmpty>
          {isPending ? 'Buscando países...' : 'Nenhum país encontrado.'}
        </ComboboxEmpty>
        <ComboboxList>
          {(country: Nationality) => (
            <ComboboxItem key={country.id} value={country}>
              <div className={'flex items-center gap-2'}>
                <img
                  src={country.flagUrl}
                  alt={''}
                  className={'size-4 shrink-0 object-contain'}
                  onError={(event) => {
                    event.currentTarget.style.visibility = 'hidden';
                  }}
                />
                <span>{country.name}</span>
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
};
