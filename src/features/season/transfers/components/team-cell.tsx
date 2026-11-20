import { Link } from 'react-router';

type TeamCellProps = {
  team: { id: string; name: string; crestUrl: string };
};

export const TeamCell = ({ team }: TeamCellProps) => {
  return (
    <Link
      to={`/clubs/${team.id}`}
      className={'flex items-center gap-1.5 text-sm hover:underline'}
    >
      <img
        src={team.crestUrl}
        alt={''}
        className={'size-4 shrink-0 object-contain'}
        onError={(event) => {
          event.currentTarget.style.visibility = 'hidden';
        }}
      />
      <span className={'truncate'}>{team.name}</span>
    </Link>
  );
};
