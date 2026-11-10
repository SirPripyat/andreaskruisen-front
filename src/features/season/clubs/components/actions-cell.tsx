import { EyeIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui';

type ActionsCellProps = {
  id: string;
};

export const ActionsCell = ({ id }: ActionsCellProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => navigate(`/teams/${id}`)}
    >
      <EyeIcon />
    </Button>
  );
};
