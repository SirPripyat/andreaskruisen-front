type SeasonCountProps = {
  squadsCount: number;
  usersCount: number;
};

export const SeasonCount = ({ usersCount, squadsCount }: SeasonCountProps) => {
  return (
    <span className={'text-muted-foreground text-xs'}>
      <span className={'font-semibold text-foreground'}>{squadsCount}</span> de{' '}
      {usersCount} times definidos
    </span>
  );
};
