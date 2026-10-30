import { useParams } from 'react-router';
import { StatTile } from '@/components';
import { Badge } from '@/components/ui';
import { TOURNAMENT_FORMAT_LABELS } from '../api';
import { useTournamentDetailDashboard } from '../hooks';

export const TournamentDetailDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const {
    gamesInThisPhase,
    topScorer,
    nextMatch,
    name,
    format,
    currentPhase,
    maxTeams,
    createdAt,
  } = useTournamentDetailDashboard(id);

  return (
    <div
      className={
        'overflow-hidden rounded-xl border-t-4 border-t-accent bg-card py-0 ring-1 ring-foreground/10'
      }
    >
      <div
        className={'flex flex-col items-start justify-between gap-2 px-5 py-4'}
      >
        <h1
          className={
            'font-display font-extrabold text-3xl uppercase tracking-tight text-balance'
          }
        >
          {name}
        </h1>

        <div className={'flex flex-wrap items-center gap-2'}>
          {format && (
            <Badge variant="outline">{TOURNAMENT_FORMAT_LABELS[format]}</Badge>
          )}

          {currentPhase && (
            <Badge className="border-transparent bg-accent-surface text-accent">
              Fase atual · {currentPhase.name}
            </Badge>
          )}

          <Badge variant="secondary">{maxTeams} times</Badge>
        </div>

        <p className={'text-muted-foreground text-xs'}>Criado em {createdAt}</p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-border border-t lg:grid-cols-4 lg:divide-y-0">
        <StatTile
          label="Times"
          value={String(maxTeams)}
          sub="Inscritos no torneio"
        />
        <StatTile
          label="Jogos nesta fase"
          value={gamesInThisPhase.value}
          sub={gamesInThisPhase.sub}
        />
        <StatTile
          label="Artilheiro"
          value={topScorer.value}
          sub={topScorer.sub}
        />
        <StatTile
          label="Próxima partida"
          value={nextMatch.value}
          sub={nextMatch.sub}
        />
      </div>
    </div>
  );
};
