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
import type { User } from '@/features/admin';

export type RequestedByUser = Pick<User, 'id' | 'name'>;

const isSameUser = (a: RequestedByUser, b: RequestedByUser) => a.id === b.id;

const filterUser = (user: RequestedByUser, query: string) =>
  user.name.toLowerCase().includes(query.toLowerCase());

export const RequestedByCombobox = ({
  users,
  value,
  onValueChange,
  placeholder = 'Quem solicitou...',
}: {
  users: RequestedByUser[];
  value: RequestedByUser | null;
  onValueChange: (user: RequestedByUser | null) => void;
  placeholder?: string;
}) => {
  return (
    <Combobox<RequestedByUser>
      items={users}
      value={value}
      onValueChange={onValueChange}
      isItemEqualToValue={isSameUser}
      itemToStringLabel={(user) => user.name}
      filter={filterUser}
    >
      <ComboboxInputGroup>
        <ComboboxInput placeholder={placeholder} />
        <ComboboxClear aria-label={'Limpar seleção'} />
        <ComboboxTrigger />
      </ComboboxInputGroup>

      <ComboboxPopup>
        <ComboboxEmpty>{'Nenhum usuário encontrado.'}</ComboboxEmpty>
        <ComboboxList>
          {(user: RequestedByUser) => (
            <ComboboxItem key={user.id} value={user}>
              {user.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
};
