import { UserIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { cn } from '@/lib';

const getInitials = (team: string) =>
  team.replace(' ', '').slice(0, 3).toUpperCase();

function TeamLink({
  teamId,
  className,
  children,
}: {
  teamId?: string;
  className?: string;
  children: ReactNode;
}) {
  if (!teamId) return <div className={className}>{children}</div>;

  return (
    <Link
      to={`/teams/${teamId}`}
      className={cn(className, 'hover:underline')}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </Link>
  );
}

type TeamChipProps = {
  teamId?: string;
  name: string;
  crestUrl?: string;
  owner?: { name: string } | null;
  align?: 'right';
  compact?: boolean;
  className?: string;
};

export const TeamChip = ({
  teamId,
  name,
  crestUrl,
  owner,
  align,
  compact,
  className,
}: TeamChipProps) => {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-1.5',
        align === 'right' && 'flex-row-reverse text-right',
        className,
      )}
    >
      <TeamLink
        teamId={teamId}
        className={cn(
          'flex min-w-0 items-center gap-1.5',
          align === 'right' && 'flex-row-reverse text-right',
        )}
      >
        {crestUrl && (
          <img
            src={crestUrl}
            alt=""
            className={cn(
              'shrink-0 object-contain',
              compact ? 'size-8' : 'size-5',
            )}
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden';
            }}
          />
        )}
        {compact ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <span
                  className={cn(
                    'truncate font-semibold',
                    owner && 'text-success',
                  )}
                >
                  {getInitials(name)}
                </span>
              }
            />
            <TooltipContent>{name}</TooltipContent>
          </Tooltip>
        ) : (
          <span className="truncate font-medium">{name}</span>
        )}
      </TeamLink>
      {owner && !compact && (
        <Tooltip>
          <TooltipTrigger
            render={<UserIcon className={'size-4 shrink-0 text-success'} />}
          />
          <TooltipContent>Controlado por {owner.name}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
