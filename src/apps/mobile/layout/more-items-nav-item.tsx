import { EllipsisIcon } from 'lucide-react';

type MoreItemsNavItemProps = {
  toggleMoreItems: () => void;
};

export const MoreItemsNavItem = ({
  toggleMoreItems,
}: MoreItemsNavItemProps) => {
  return (
    <button
      type={'button'}
      onClick={toggleMoreItems}
      className={
        'flex flex-1 flex-col items-center justify-center gap-0.5 text-muted-foreground transition-transform active:scale-95'
      }
    >
      <EllipsisIcon className={'size-6.5'} strokeWidth={1.75} />
      <span className={'text-[10px] font-medium leading-none'}>Mais</span>
    </button>
  );
};
