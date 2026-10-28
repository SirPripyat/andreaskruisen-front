import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export const PageHeader = ({
  title,
  description,
  actions,
}: PageHeaderProps) => {
  return (
    <div className={'flex flex-wrap items-center justify-between gap-4'}>
      <div className={'flex flex-col gap-1'}>
        <h1 className={'font-display font-semibold text-2xl'}>{title}</h1>
        {description && (
          <p className={'max-w-2xl text-sm text-muted-foreground'}>
            {description}
          </p>
        )}
      </div>

      {actions}
    </div>
  );
};
