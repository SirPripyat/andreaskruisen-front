import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui';
import type { User } from '../api';
import { DeleteUserDialog } from './delete-user-dialog';

export const UserRowActions = ({ user }: { user: User }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Excluir ${user.name}`}
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2Icon className="text-destructive" />
      </Button>

      <DeleteUserDialog
        userId={user.id}
        userName={user.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
};
