import { useParams } from 'react-router';
import { Skeleton } from '@/components/ui';
import { useBreadcrumbItems } from '@/hooks';
import { calculateAge } from '@/lib';
import { PlayerInfoPanel } from './components';
import { usePlayer } from './hooks';

export const PlayerDetailScreen = () => {
  const { id } = useParams<{ id: string }>();

  const { data: player, isPending } = usePlayer(id);

  useBreadcrumbItems([{ label: player?.name ?? '' }]);

  if (isPending || !player) {
    return (
      <div className={'flex flex-col gap-4'}>
        <Skeleton className={'h-24 w-full'} />
        <Skeleton className={'h-32 w-full'} />
      </div>
    );
  }

  return (
    <PlayerInfoPanel
      photoUrl={player.photoUrl}
      name={player.name}
      team={player.team}
      nationality={player.nationality}
      positions={player.positions}
      preferredFoot={player.preferredFoot}
      age={calculateAge(player.birthdate)}
      overall={player.latestRating?.overallRating ?? null}
    />
  );
};
