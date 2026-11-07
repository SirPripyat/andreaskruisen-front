type TeamCellProps = {
  team: { name: string; crestUrl: string };
};

export const TeamCell = ({ team }: TeamCellProps) => {
  return (
    <div className={'flex items-center gap-1.5 text-sm'}>
      <img
        src={team.crestUrl}
        alt={''}
        className={'size-4 shrink-0 object-contain'}
        onError={(event) => {
          event.currentTarget.style.visibility = 'hidden';
        }}
      />
      <span className={'truncate'}>{team.name}</span>
    </div>
  );
};
