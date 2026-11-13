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
import { useDeleteSeason } from '../hooks';

type DeleteSeasonDialogProps = {
  seasonId: string;
  seasonName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DeleteSeasonDialog = ({
  seasonId,
  seasonName,
  open,
  onOpenChange,
}: DeleteSeasonDialogProps) => {
  const { mutate, isPending } = useDeleteSeason();

  const handleConfirm = () =>
    mutate(seasonId, {
      onSuccess: () => {
        toast.success(`Temporada "${seasonName}" excluída.`);
        onOpenChange(false);
      },
    });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir "{seasonName}"?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Torneios, elencos e vínculos de
            jogadores dessa temporada serão removidos permanentemente.
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
};
