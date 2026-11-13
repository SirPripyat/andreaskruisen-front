import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import type { Tournament } from '../types';
import { DeleteTournamentDialog } from './delete-tournament-dialog';
import { EditTournamentDrawer } from './edit-tournament-drawer';

export const TournamentActionsMenu = ({
  tournament,
}: {
  tournament: Tournament;
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Ações para ${tournament.name}`}
            >
              <MoreHorizontalIcon />
            </Button>
          }
        />

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            render={<Link to={`/tournaments/${tournament.id}`} />}
          >
            <EyeIcon />
            Ver detalhes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <PencilIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTournamentDrawer
        id={tournament.id}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteTournamentDialog
        tournamentId={tournament.id}
        tournamentName={tournament.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
};
