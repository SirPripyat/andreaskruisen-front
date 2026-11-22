import {
  CheckCircle2Icon,
  ChevronsRightIcon,
  ClockIcon,
  Loader2Icon,
  TrophyIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { cn } from '@/lib';
import { isDecisivePhase } from '../api';
import {
  useAdvancePhase,
  useTournament,
  useTournamentDashboard,
} from '../hooks';
import { FinishTournamentButton } from './finish-tournament-button';

type PhaseActionBarProps = {
  tournamentId: string | undefined;
};

export const PhaseActionBar = ({ tournamentId }: PhaseActionBarProps) => {
  // O endpoint de dashboard não garante `finishedAt`/`champion` — só o
  // detalhe "cru" do torneio é confiável pra esses dois campos.
  const { data: tournament } = useTournament(tournamentId);
  const { data: dashboard } = useTournamentDashboard(tournamentId);

  const { mutate: advancePhase, isPending: isAdvancing } =
    useAdvancePhase(tournamentId);

  if (!tournament || !dashboard) return null;

  const { format, currentPhase, finishedAt, champion } = tournament;
  const { totalMatches, playedMatches } = dashboard;

  if (finishedAt) {
    return (
      <div
        className={
          'flex flex-wrap items-center gap-2 rounded-xl border border-success bg-success-surface px-3.5 py-2.5 text-sm font-semibold text-success'
        }
      >
        <TrophyIcon className={'size-4 shrink-0'} />
        {champion
          ? `Torneio finalizado — ${champion.name} é o campeão.`
          : 'Torneio finalizado.'}
      </div>
    );
  }

  if (!currentPhase) return null;

  const decisive = isDecisivePhase(format, currentPhase.name);
  const allPlayed = totalMatches > 0 && playedMatches === totalMatches;

  const handleAdvance = () =>
    advancePhase(currentPhase.id, {
      onSuccess: () => {
        toast.success('Fase avançada — a próxima rodada já foi gerada.');
      },
    });

  const text = decisive
    ? allPlayed
      ? `${currentPhase.name} concluída — finalize o torneio para coroar o campeão.`
      : `Dispute a ${currentPhase.name.toLowerCase()} para encerrar o torneio.`
    : allPlayed
      ? `${currentPhase.name} concluída — a próxima fase já pode ser gerada.`
      : `Dispute as partidas da ${currentPhase.name.toLowerCase()} para liberar a próxima fase.`;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-dashed px-3.5 py-2.5',
        allPlayed && 'border-solid border-accent bg-accent-surface',
      )}
    >
      <span
        className={cn(
          'flex items-center gap-1.5 text-sm text-muted-foreground',
          allPlayed && 'font-medium text-foreground',
        )}
      >
        {allPlayed ? (
          <CheckCircle2Icon className={'size-4 shrink-0 text-accent'} />
        ) : (
          <ClockIcon className={'size-4 shrink-0'} />
        )}
        {text}
      </span>

      {decisive ? (
        <FinishTournamentButton
          tournamentId={tournamentId as string}
          disabled={!allPlayed}
        />
      ) : (
        <Button
          type={'button'}
          disabled={!allPlayed || isAdvancing}
          onClick={handleAdvance}
        >
          {isAdvancing ? (
            <Loader2Icon className={'animate-spin'} />
          ) : (
            <ChevronsRightIcon />
          )}
          Avançar fase
        </Button>
      )}
    </div>
  );
};
