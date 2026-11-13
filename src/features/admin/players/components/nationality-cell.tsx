import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getInitials } from '@/lib';

type NationalityCellProps = {
  flagUrl: string;
  name: string;
};

export const NationalityCell = ({ flagUrl, name }: NationalityCellProps) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm" className="bg-muted">
        <AvatarImage src={flagUrl} alt={name} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <span>{name}</span>
    </div>
  );
};
