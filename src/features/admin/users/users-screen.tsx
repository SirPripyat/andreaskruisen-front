import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { PageHeader } from '@/components';
import { Badge, DataTable } from '@/components/ui';
import { CreateUserDrawer, UserAvatarCell, UserRowActions } from './components';
import { useUsers } from './hooks';
import type { User } from './types';
import { USER_ROLE_BADGE_VARIANT, USER_ROLE_LABELS } from './utils';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => <UserAvatarCell name={row.original.name} />,
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: 'role',
    header: 'Função',
    cell: ({ row }) => (
      <Badge variant={USER_ROLE_BADGE_VARIANT[row.original.role]}>
        {USER_ROLE_LABELS[row.original.role]}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: '',
    meta: { className: 'text-right' },
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];

export const UsersScreen = () => {
  const { data: users, isPending, isError, error } = useUsers();

  const table = useReactTable({
    data: users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageHeader
        title={'Usuários'}
        description={
          'Contas com acesso à plataforma e seus papéis de permissão.'
        }
        actions={<CreateUserDrawer />}
      />

      <DataTable<User>
        table={table}
        isPending={isPending}
        isError={isError}
        error={error}
        errorMessage={'Não foi possível carregar os usuários.'}
        emptyMessage={'Nenhum usuário criado ainda.'}
        skeletonRowCount={3}
      />
    </>
  );
};
