import { useParams } from 'react-router';
import { useTournamentTopAssists } from '../hooks';
import { GoalLeadersList } from './goal-leaders-list';

export const TopAssistsTab = () => {
  const { id } = useParams<{ id: string }>();
  const { data: leaders } = useTournamentTopAssists(id);

  if (leaders?.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm">
        Nenhuma assistência registrada ainda.
      </p>
    );
  }

  return <GoalLeadersList leaders={leaders ?? []} countLabel="assist." />;
};
