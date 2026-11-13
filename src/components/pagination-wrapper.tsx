import { cn } from '@/lib';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from './ui';

type PaginationWrapperProps = {
  page: number;
  totalPages: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
};

export const PaginationWrapper = ({
  page,
  totalPages,
  handlePreviousPage,
  handleNextPage,
}: PaginationWrapperProps) => {
  return (
    <div className={'flex items-center justify-between'}>
      <span className="text-muted-foreground text-xs">
        Página {page} de {totalPages}
      </span>

      <Pagination className="mx-0 w-fit">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text="Anterior"
              onClick={(event) => {
                event.preventDefault();
                handlePreviousPage();
              }}
              aria-disabled={page === 1}
              className={cn(page === 1 && 'pointer-events-none opacity-50')}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              text="Próxima"
              onClick={(event) => {
                event.preventDefault();
                handleNextPage();
              }}
              aria-disabled={page === totalPages}
              className={cn(
                page === totalPages && 'pointer-events-none opacity-50',
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
