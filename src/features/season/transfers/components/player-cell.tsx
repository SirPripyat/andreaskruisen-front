import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';

type PlayerCellProps = {
  player: { id: string; name: string; photoUrl: string };
};

export const PlayerCell = ({ player }: PlayerCellProps) => {
  return (
    <Link
      to={`/players/${player.id}`}
      className={'flex items-center gap-2 hover:underline'}
    >
      <Avatar size={'sm'}>
        <AvatarImage src={player.photoUrl} alt={''} />
        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className={'truncate font-medium text-sm'}>{player.name}</span>
    </Link>
  );
};
