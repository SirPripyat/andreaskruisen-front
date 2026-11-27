type TeamOptionTeam = { id: string; name: string; crestUrl: string };

export const TeamOption = ({ team }: { team: TeamOptionTeam }) => {
  return (
    <span className={'flex min-w-0 items-center gap-2'}>
      <img
        src={team.crestUrl}
        alt={''}
        className={'size-4 shrink-0 object-contain'}
        onError={(event) => {
          event.currentTarget.style.visibility = 'hidden';
        }}
      />
      <span className={'truncate'}>{team.name}</span>
    </span>
  );
};
