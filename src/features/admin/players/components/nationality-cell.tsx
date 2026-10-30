import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';

type NationalityCellProps = {
  flagUrl: string;
  name: string;
};

export const NationalityCell = ({ flagUrl, name }: NationalityCellProps) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm" className="bg-muted">
        <AvatarImage
          src={flagUrl}
          className="aspect-square size-full scale-[1.9]"
          alt=""
        />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span>{name}</span>
    </div>
  );
};
