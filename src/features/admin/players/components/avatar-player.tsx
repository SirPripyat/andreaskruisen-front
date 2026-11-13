import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getInitials } from '@/lib';

type AvatarPlayerProps = {
  photoUrl: string;
  name: string;
};

export const AvatarPlayer = ({ photoUrl, name }: AvatarPlayerProps) => {
  return (
    <div className={'flex items-center gap-2'}>
      <Avatar size={'lg'}>
        <AvatarImage src={photoUrl} alt={name} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <span className={'font-medium'}>{name}</span>
    </div>
  );
};
