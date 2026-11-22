import { UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui';

type FixturesOwnedTeamsFilterProps = {
  value: boolean;
  onValueChange: (onlyOwnedTeams: boolean) => void;
};

export const FixturesOwnedTeamsFilter = ({
  value,
  onValueChange,
}: FixturesOwnedTeamsFilterProps) => {
  return (
    <Button
      variant={value ? 'default' : 'outline'}
      size={'sm'}
      onClick={() => onValueChange(!value)}
    >
      <UsersIcon />
      Meus times
    </Button>
  );
};
