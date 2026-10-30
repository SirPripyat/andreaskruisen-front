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
import { useDeleteUser } from '../hooks';

type DeleteUserDialogProps = {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DeleteUserDialog = ({
  userId,
  userName,
  open,
  onOpenChange,
}: DeleteUserDialogProps) => {
  const { mutate, isPending } = useDeleteUser();

  const handleConfirm = () =>
    mutate(userId, {
      onSuccess: () => {
        toast.success(`Usuário "${userName}" excluído.`);
        onOpenChange(false);
      },
    });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir "{userName}"?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. O usuário perderá o acesso à
            plataforma imediatamente.
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
