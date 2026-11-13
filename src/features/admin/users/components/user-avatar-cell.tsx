import { Avatar, AvatarFallback } from '@/components/ui';
import { getInitials } from '@/lib';

type UserAvatarCellProps = {
  name: string;
};

export const UserAvatarCell = ({ name }: UserAvatarCellProps) => {
  return (
    <Avatar>
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
};
