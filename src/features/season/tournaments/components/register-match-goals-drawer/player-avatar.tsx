import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import type { MatchPlayerOption } from '../../api';

type PlayerAvatarProps = {
  player: MatchPlayerOption;
  className?: string;
};

export const PlayerAvatar = ({ player, className }: PlayerAvatarProps) => {
  return (
    <Avatar size="sm" className={className}>
      <AvatarImage src={player.photoUrl} alt="" />
      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};
