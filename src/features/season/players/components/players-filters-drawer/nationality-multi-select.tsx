import { XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  Badge,
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

const PAGE_SIZE = 20;

type NationalityMultiSelectProps = {
  value: string[];
  onValueChange: (ids: string[]) => void;
};

export const NationalityMultiSelect = ({
  value,
  onValueChange,
}: NationalityMultiSelectProps) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data, isPending } = useNationalities({
    name: debouncedQuery || undefined,
    page: 1,
    pageSize: PAGE_SIZE,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // Como não existe um endpoint pra buscar nacionalidades por id, guardamos
  // aqui toda nacionalidade já vista em alguma busca, só pra conseguir
  // exibir o nome nos badges selecionados (não precisa resolver de novo).
  const knownRef = useRef<Record<string, Nationality>>({});
  useEffect(() => {
    for (const nationality of data?.data ?? []) {
      knownRef.current[nationality.id] = nationality;
    }
  }, [data]);

  const options = (data?.data ?? []).filter(
    (nationality) => !value.includes(nationality.id),
  );

  const remove = (id: string) =>
    onValueChange(value.filter((selectedId) => selectedId !== id));

  return (
    <div className={'flex flex-col gap-2'}>
      {value.length > 0 && (
        <div className={'flex flex-wrap gap-1.5'}>
          {value.map((id) => (
            <Badge key={id} variant={'outline'} className={'gap-1 pr-1'}>
              {knownRef.current[id]?.name ?? id}
              <button
                type={'button'}
                onClick={() => remove(id)}
                aria-label={'Remover nacionalidade'}
              >
                <XIcon className={'size-3'} />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Combobox<Nationality>
        items={options}
        value={null}
        onValueChange={(nationality) => {
          if (!nationality) return;
          onValueChange([...value, nationality.id]);
          setQuery('');
        }}
        onInputValueChange={setQuery}
        itemToStringLabel={(nationality) => nationality.name}
        filter={null}
      >
        <ComboboxInputGroup>
          <ComboboxInput placeholder={'Buscar nacionalidade...'} />
          <ComboboxTrigger />
        </ComboboxInputGroup>

        <ComboboxPopup>
          <ComboboxEmpty>
            {isPending ? 'Buscando...' : 'Nenhuma nacionalidade encontrada.'}
          </ComboboxEmpty>
          <ComboboxList>
            {(nationality: Nationality) => (
              <ComboboxItem key={nationality.id} value={nationality}>
                {nationality.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    </div>
  );
};
