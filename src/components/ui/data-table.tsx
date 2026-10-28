import type { Column, Table as TanstackTable } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { cn } from 'cn';
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  CircleAlertIcon,
  InboxIcon,
} from 'lucide-react';
import { getErrorMessage } from '@/lib';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from './pagination';
import { Skeleton } from './skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

const numberFormatter = new Intl.NumberFormat('pt-BR');

declare module '@tanstack/react-table' {
  // Declaration merging is the only way to extend a library's generic
  // interface, so `interface` is required here instead of `type`.
  interface ColumnMeta<TData, TValue> {
    className?: string;
  }
}

type DataTableProps<TData> = {
  table: TanstackTable<TData>;
  isPending?: boolean;
  isError?: boolean;
  error?: unknown;
  errorMessage?: string;
  emptyMessage?: string;
  skeletonRowCount?: number;
  className?: string;
};

export function DataTable<TData>({
  table,
  isPending,
  isError,
  error,
  errorMessage = 'Não foi possível carregar os dados.',
  emptyMessage = 'Nenhum dado encontrado.',
  skeletonRowCount = 5,
  className,
}: DataTableProps<TData>) {
  const columnCount = table.getAllLeafColumns().length;
  const rows = table.getRowModel().rows;

  return (
    <div className="rounded-xl border">
      <Table className={className}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    header.column.columnDef.meta?.className,
                    'font-normal text-sm text-muted-foreground',
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isPending &&
            Array.from(
              { length: skeletonRowCount },
              (_, index) => `skeleton-row-${index}`,
            ).map((rowKey) => (
              <TableRow key={rowKey}>
                {table.getAllLeafColumns().map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton className="h-5 w-full max-w-32" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isPending && isError && (
            <TableRow>
              <TableCell colSpan={columnCount} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                  <CircleAlertIcon className="size-5" />
                  <span className="text-sm">
                    {getErrorMessage(error, errorMessage)}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isPending && !isError && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columnCount} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <InboxIcon className="size-5" />
                  <span className="text-sm">{emptyMessage}</span>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isPending &&
            !isError &&
            rows.map((row, index) => (
              <TableRow
                key={row.id}
                className={index % 2 === 1 ? 'bg-muted/40' : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cell.column.columnDef.meta?.className}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  children: React.ReactNode;
};

export function DataTableColumnHeader<TData, TValue>({
  column,
  children,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <>{children}</>;
  }

  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn(
        'inline-flex items-center gap-1 hover:text-foreground',
        sorted && 'text-accent',
      )}
    >
      {children}
      {sorted === 'asc' && <ArrowUpIcon className="size-3.5" />}
      {sorted === 'desc' && <ArrowDownIcon className="size-3.5" />}
      {!sorted && (
        <ArrowUpDownIcon className="size-3.5 text-muted-foreground/50" />
      )}
    </button>
  );
}

type DataTablePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function DataTablePagination({
  page,
  totalPages,
  onPageChange,
  className,
}: DataTablePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <span className="text-muted-foreground text-sm">
        Página {numberFormatter.format(page)} de{' '}
        {numberFormatter.format(totalPages)}
      </span>
      <Pagination className="mx-0 w-fit">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text="Anterior"
              onClick={(event) => {
                event.preventDefault();
                onPageChange(Math.max(1, page - 1));
              }}
              aria-disabled={page === 1}
              className={cn(
                'text-accent hover:bg-accent/10 hover:text-accent',
                page === 1 && 'pointer-events-none opacity-50',
              )}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              text="Próxima"
              onClick={(event) => {
                event.preventDefault();
                onPageChange(Math.min(totalPages, page + 1));
              }}
              aria-disabled={page === totalPages}
              className={cn(
                'text-accent hover:bg-accent/10 hover:text-accent',
                page === totalPages && 'pointer-events-none opacity-50',
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
