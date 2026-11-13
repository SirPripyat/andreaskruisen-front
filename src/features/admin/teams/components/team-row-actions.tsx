import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui';
import type { TeamWithRatings } from '../types';
import { EditTeamCrestDrawer } from './edit-team-drawer';

export const TeamRowActions = ({ team }: { team: TeamWithRatings }) => {
  const [editOpen, setEditOpen] = useState(false);

  const toggleOpen = () => setEditOpen((prev) => !prev);

  return (
    <>
      <Button
        variant={'ghost'}
        size={'icon-sm'}
        aria-label={`Editar ${team.name}`}
        onClick={toggleOpen}
      >
        <PencilIcon />
      </Button>

      <EditTeamCrestDrawer
        id={team.id}
        open={editOpen}
        toggleOpen={toggleOpen}
      />
    </>
  );
};
