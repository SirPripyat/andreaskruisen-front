import { TrophyIcon } from 'lucide-react';
import { useParams } from 'react-router';
import { StatTile } from '@/components';
import { Badge } from '@/components/ui';
import {
  useLeagueProgress,
  useTournamentDetailDashboard,
  useTournamentPhaseStepper,
} from '../hooks';
import { TOURNAMENT_FORMAT_LABELS } from '../types';
import { PhaseActionBar } from './phase-action-bar';
import { PhaseStepper } from './phase-stepper';
import { TournamentFormatIcon } from './tournament-format-icon';

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
  const steps = useTournamentPhaseStepper(id);
  const leagueProgress = useLeagueProgress(id);

  return (
    <div
      className={
        'overflow-hidden rounded-xl bg-card py-0 ring-1 ring-foreground/10'
      }
    >
      <div className={'h-1.5 bg-gradient-to-r from-accent to-accent-hover'} />

      <div className={'flex flex-wrap items-center gap-3 px-5 py-4'}>
        <div className={'flex min-w-0 items-center gap-3.5'}>
          <span
            className={
              'flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-surface text-accent'
            }
          >
            <TrophyIcon className={'size-5'} />
          </span>

          <h1
            className={
              'truncate font-display font-extrabold text-3xl uppercase tracking-tight leading-none'
            }
          >
            {name}
          </h1>
        </div>

        <div className={'flex flex-wrap items-center gap-2'}>
          {format && (
            <Badge variant="outline" className={'gap-1.5'}>
              <TournamentFormatIcon format={format} className={'size-3.5'} />
              {TOURNAMENT_FORMAT_LABELS[format]}
            </Badge>
          )}

          {currentPhase && (
            <Badge className="border-transparent bg-accent-surface text-accent">
              {`Fase atual · ${currentPhase.name}`}
            </Badge>
          )}

          <Badge variant="secondary">{maxTeams} times</Badge>
        </div>

        <p
          className={'ml-auto whitespace-nowrap text-xs text-muted-foreground'}
        >
          Criado em {createdAt}
        </p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-border border-t lg:grid-cols-4 lg:divide-y-0">
        <StatTile
          label="Times"
          value={String(maxTeams)}
          sub="Inscritos no torneio"
        />
        <StatTile
          label={
            format === 'LEAGUE' ? 'Jogos na temporada' : 'Jogos nesta fase'
          }
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

      {steps.length > 0 && (
        <div className={'border-t px-4 pt-3'}>
          <PhaseStepper steps={steps} />
        </div>
      )}

      {leagueProgress && (
        <div className={'border-t px-4 py-3'}>
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wide">
              Progresso da temporada
            </span>
            <span className="font-mono font-semibold text-xs">
              Rodada {leagueProgress.currentRound} de{' '}
              {leagueProgress.totalRounds}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover"
              style={{
                width: `${Math.round(
                  (leagueProgress.playedMatches / leagueProgress.totalMatches) *
                    100,
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className={'px-4 py-3.5'}>
        <PhaseActionBar tournamentId={id} />
      </div>
    </div>
  );
};
