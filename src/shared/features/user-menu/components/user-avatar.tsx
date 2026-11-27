import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { useAvatar } from '@/features/auth';
import { getInitials } from '@/lib';

type UserAvatarProps = {
  name: string;
  size?: 'default' | 'sm' | 'lg';
};

export const UserAvatar = ({ name, size }: UserAvatarProps) => {
  const { url: avatarUrl } = useAvatar();

  return (
    <Avatar size={size}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={''} />}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
};
