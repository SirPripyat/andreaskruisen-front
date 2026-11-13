import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui';
import type { LeagueWithCountry } from '../types';
import { EditLeagueDrawer } from './edit-league-drawer';

export const LeagueRowActions = ({ league }: { league: LeagueWithCountry }) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Button
        variant={'ghost'}
        size={'icon-sm'}
        aria-label={`Editar ${league.name}`}
        onClick={() => setEditOpen(true)}
      >
        <PencilIcon />
      </Button>

      <EditLeagueDrawer
        id={league.id}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
};
