import { useParams } from 'react-router';
import { useTournamentTopScorers } from '../hooks';
import { GoalLeadersList } from './goal-leaders-list';

export const TopScorersTab = () => {
  const { id } = useParams<{ id: string }>();
  const { data: leaders } = useTournamentTopScorers(id);

  if (leaders?.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm">
        Nenhum gol registrado ainda.
      </p>
    );
  }

  return <GoalLeadersList leaders={leaders ?? []} countLabel="gols" />;
};
