import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';

type PlayerCellProps = {
  player: { name: string; photoUrl: string };
};

export const PlayerCell = ({ player }: PlayerCellProps) => {
  return (
    <div className={'flex items-center gap-2'}>
      <Avatar size={'sm'}>
        <AvatarImage src={player.photoUrl} alt={''} />
        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className={'truncate font-medium text-sm'}>{player.name}</span>
    </div>
  );
};
