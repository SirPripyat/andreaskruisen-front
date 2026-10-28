import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { PageHeader } from '@/components';
import { Badge, DataTable } from '@/components/ui';
import { USER_ROLE_LABELS, type User } from './api';
import { CreateUserDrawer } from './components';
import { useUsers } from './hooks';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: 'role',
    header: 'Função',
    cell: ({ row }) => (
      <Badge variant="outline">{USER_ROLE_LABELS[row.original.role]}</Badge>
    ),
  },
];

export function UsersScreen() {
  const { data: users, isPending, isError, error } = useUsers();

  const table = useReactTable({
    data: users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-1 flex-col gap-4">
      <PageHeader
        title="Usuários"
        description="Contas com acesso à plataforma e seus papéis de permissão."
        actions={<CreateUserDrawer />}
      />

      <DataTable
        table={table}
        isPending={isPending}
        isError={isError}
        error={error}
        errorMessage="Não foi possível carregar os usuários."
        emptyMessage="Nenhum usuário criado ainda."
        skeletonRowCount={3}
      />
    </div>
  );
}
