import type { ReactNode } from 'react';

type SectionProps = {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
};

export const Section = ({ title, meta, children }: SectionProps) => (
  <div className={'flex flex-col gap-3 bg-card p-4 rounded-xl border'}>
    <div className={'flex items-baseline justify-between gap-3'}>
      <span className={'font-display font-bold text-md uppercase'}>
        {title}
      </span>
      {meta}
    </div>
    {children}
  </div>
);
