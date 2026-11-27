import { StarIcon } from 'lucide-react';
import type { MouseEvent } from 'react';
import { Button } from '@/components/ui';
import { cn } from '@/lib';
import { useAddFavorite, useRemoveFavorite } from '../hooks';

type FavoriteButtonProps = {
  playerId: string;
  isFavorite: boolean;
  fullWidth?: boolean;
};

export const FavoriteButton = ({
  playerId,
  isFavorite,
  fullWidth = false,
}: FavoriteButtonProps) => {
  const { mutate: addFavorite, isPending: isAdding } = useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavorite();

  const label = isFavorite ? 'Desfavoritar' : 'Favoritar';

  const toggle = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isFavorite) {
      removeFavorite(playerId);
    } else {
      addFavorite(playerId);
    }
  };

  if (fullWidth) {
    return (
      <Button
        variant={'outline'}
        className={'w-full'}
        disabled={isAdding || isRemoving}
        onClick={toggle}
      >
        <StarIcon
          className={cn(isFavorite && 'fill-yellow-400 text-yellow-400')}
        />
        {label}
      </Button>
    );
  }

  return (
    <Button
      variant={'ghost'}
      size={'icon-sm'}
      aria-label={label}
      disabled={isAdding || isRemoving}
      onClick={toggle}
    >
      <StarIcon
        className={cn(isFavorite && 'fill-yellow-400 text-yellow-400')}
      />
    </Button>
  );
};
