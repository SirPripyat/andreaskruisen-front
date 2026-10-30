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
} from '@/components/ui';
import { useDeleteTournament } from '../hooks';

export function DeleteTournamentDialog({
  tournamentId,
  tournamentName,
  seasonId,
  open,
  onOpenChange,
  onDeleted,
}: {
  tournamentId: string;
  tournamentName: string;
  seasonId: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}) {
  const { mutate, isPending } = useDeleteTournament(seasonId);

  function handleConfirm() {
    mutate(tournamentId, {
      onSuccess: () => {
        toast.success(`Torneio "${tournamentName}" excluído.`);
        onDeleted?.();
      },
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir "{tournamentName}"?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. O torneio e os vínculos dos times
            com ele serão removidos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleConfirm}>
            {isPending ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
