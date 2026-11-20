type SquadOptionSquad = {
  team: { name: string; crestUrl: string };
  user: { name: string };
};

export const SquadOption = ({ squad }: { squad: SquadOptionSquad }) => {
  return (
    <span className={'flex min-w-0 items-center gap-2'}>
      <img
        src={squad.team.crestUrl}
        alt={''}
        className={'size-4 shrink-0 object-contain'}
        onError={(event) => {
          event.currentTarget.style.visibility = 'hidden';
        }}
      />
      <span className={'flex min-w-0 flex-col'}>
        <span className={'truncate'}>{squad.team.name}</span>
        <span className={'truncate text-muted-foreground text-xs'}>
          {squad.user.name}
        </span>
      </span>
    </span>
  );
};
