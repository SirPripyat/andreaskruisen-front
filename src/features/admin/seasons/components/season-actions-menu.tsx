import { MoreHorizontalIcon, Pencil, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import type { Season } from '../types';
import { DeleteSeasonDialog } from './delete-season-dialog';
import { EditSeasonDrawer } from './edit-season-drawer';

export const SeasonActionsMenu = ({ season }: { season: Season }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Ações para ${season.name}`}
            >
              <MoreHorizontalIcon />
            </Button>
          }
        />

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil />
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

      <DeleteSeasonDialog
        seasonId={season.id}
        seasonName={season.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />

      <EditSeasonDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        id={season.id}
      />
    </>
  );
};
