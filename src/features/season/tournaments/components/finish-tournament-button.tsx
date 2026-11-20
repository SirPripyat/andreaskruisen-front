import { FlagIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@/components/ui';
import { useFinishTournament } from '../hooks';

type FinishTournamentButtonProps = {
  tournamentId: string;
  disabled?: boolean;
};

export const FinishTournamentButton = ({
  tournamentId,
  disabled,
}: FinishTournamentButtonProps) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useFinishTournament(tournamentId);

  const handleConfirm = () => {
    mutate(undefined, {
      onSuccess: () => {
        toast.success('Torneio finalizado.');
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button type="button" variant="outline" size="sm" disabled={disabled}>
            <FlagIcon />
            Finalizar torneio
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Finalizar torneio?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Depois de finalizado, os resultados
            das partidas não poderão mais ser editados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="default"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <FlagIcon />
            )}
            Finalizar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
