import { DicesIcon, Loader2Icon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui';
import type { MatchListItem } from '../types';

type SimulateMatchesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchIds: string[];
  matches: MatchListItem[];
  isPending: boolean;
  onConfirm: () => void;
};

export const SimulateMatchesDialog = ({
  open,
  onOpenChange,
  matchIds,
  matches,
  isPending,
  onConfirm,
}: SimulateMatchesDialogProps) => {
  const affected = matchIds
    .map((id) => matches.find((match) => match.id === id))
    .filter((match): match is MatchListItem => !!match);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {'Simular '}
            {affected.length}
            {affected.length > 1 ? ' partidas?' : ' partida?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Os placares abaixo serão gerados automaticamente. Você pode
            editá-los depois se quiser outro resultado.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ul className={'flex max-h-48 flex-col gap-1 overflow-y-auto text-sm'}>
          {affected.map((match) => (
            <li
              key={match.id}
              className={
                'flex items-center justify-between gap-2 rounded-md bg-muted px-2.5 py-1.5'
              }
            >
              <span className={'truncate'}>
                {match.homeTeam.name}
                {' vs '}
                {match.awayTeam?.name ?? 'Bye'}
              </span>
              {match.round !== null && (
                <span
                  className={'shrink-0 font-mono text-muted-foreground text-xs'}
                >
                  {'Rodada '}
                  {match.round}
                </span>
              )}
            </li>
          ))}
        </ul>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant={'default'}
            disabled={isPending || affected.length === 0}
            onClick={onConfirm}
          >
            {isPending ? (
              <Loader2Icon className={'animate-spin'} />
            ) : (
              <DicesIcon />
            )}
            Confirmar simulação
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
