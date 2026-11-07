import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui';
import type { TeamWithRatings } from '../api';
import { EditTeamCrestDrawer } from './edit-team-crest-drawer';

export const TeamRowActions = ({ team }: { team: TeamWithRatings }) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Button
        variant={'ghost'}
        size={'icon-sm'}
        aria-label={`Editar ${team.name}`}
        onClick={() => setEditOpen(true)}
      >
        <PencilIcon />
      </Button>

      <EditTeamCrestDrawer
        team={team}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
};
