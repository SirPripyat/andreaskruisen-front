import { EyeIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui';

type ActionCellProps = {
  id: string;
};

export const ActionCell = ({ id }: ActionCellProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant={'ghost'}
      size="icon-sm"
      onClick={() => navigate(`/players/${id}`)}
    >
      <EyeIcon />
    </Button>
  );
};
