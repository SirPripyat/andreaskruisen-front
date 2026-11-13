import { useState } from 'react';

type NationalityFlagCellProps = {
  flagUrl: string;
  name: string;
};

export const NationalityFlagCell = ({
  flagUrl,
  name,
}: NationalityFlagCellProps) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={'flex items-center gap-2'}>
      {!flagUrl || hasError ? (
        <div
          className={
            'flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs'
          }
        >
          {name.charAt(0)}
        </div>
      ) : (
        <div className={'size-6 shrink-0 overflow-hidden rounded-full'}>
          <img
            src={flagUrl}
            alt={name}
            className={'aspect-square size-full object-cover'}
            onError={() => setHasError(true)}
          />
        </div>
      )}
      <span>{name}</span>
    </div>
  );
};
