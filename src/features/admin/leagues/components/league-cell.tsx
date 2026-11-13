import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getInitials } from '@/lib';

type LeagueCellProps = {
  logoUrl: string | null;
  name: string;
};

export const LeagueCell = ({ logoUrl, name }: LeagueCellProps) => {
  return (
    <div className={'flex items-center gap-2'}>
      <Avatar
        className={
          'rounded-md bg-white after:rounded-md flex items-center justify-center'
        }
      >
        {logoUrl && (
          <AvatarImage
            src={logoUrl}
            alt={name}
            className={' rounded-none size-6'}
          />
        )}

        <AvatarFallback className={'rounded-md'}>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <span>{name}</span>
    </div>
  );
};
