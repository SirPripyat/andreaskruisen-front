import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui';
import type { Nationality } from '../types';
import { EditNationalityDrawer } from './edit-nationality-drawer';

export const NationalityRowActions = ({
  nationality,
}: {
  nationality: Nationality;
}) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Button
        variant={'ghost'}
        size={'icon-sm'}
        aria-label={`Editar ${nationality.name}`}
        onClick={() => setEditOpen(true)}
      >
        <PencilIcon />
      </Button>

      <EditNationalityDrawer
        id={nationality.id}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
};
