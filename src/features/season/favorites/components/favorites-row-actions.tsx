import { EyeIcon, XIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui';
import { NegotiateButton } from '@/shared/features/players';
import { useRemoveFavorite } from '../hooks';

type FavoritesRowActionsProps = {
  playerId: string;
  teamId: string;
};

export const FavoritesRowActions = ({
  playerId,
  teamId,
}: FavoritesRowActionsProps) => {
  const navigate = useNavigate();
  const { mutate: removeFavorite, isPending } = useRemoveFavorite();

  return (
    <div className={'flex items-center justify-end gap-1'}>
      <NegotiateButton playerId={playerId} teamId={teamId} compact />
      <Button
        variant={'ghost'}
        size={'icon-sm'}
        aria-label={'Ver detalhes do jogador'}
        onClick={() => navigate(`/players/${playerId}`)}
      >
        <EyeIcon />
      </Button>
      <Button
        variant={'ghost'}
        size={'icon-sm'}
        aria-label={'Remover dos favoritos'}
        disabled={isPending}
        onClick={() => removeFavorite(playerId)}
      >
        <XIcon />
      </Button>
    </div>
  );
};
