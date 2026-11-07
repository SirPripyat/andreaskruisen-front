import { ArrowLeftRightIcon } from 'lucide-react';

export const SwapAxis = () => {
  return (
    <div
      className={'flex items-center gap-2 sm:w-10 sm:flex-col sm:self-stretch'}
    >
      <span className={'h-px flex-1 bg-border sm:h-auto sm:w-px'} />
      <span
        className={
          'flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-primary shadow-sm'
        }
      >
        <ArrowLeftRightIcon className={'size-4'} />
      </span>
      <span className={'h-px flex-1 bg-border sm:h-auto sm:w-px'} />
    </div>
  );
};
