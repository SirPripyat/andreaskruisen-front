import { DoorClosedIcon, DoorOpenIcon } from 'lucide-react';
import {
  Badge,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { useSelectedSeason } from '@/features/admin/seasons';
import { formatDateTime } from '@/lib';
import { useNegotiationWindowStatus } from '../hooks';

export const NegotiationWindowIndicator = () => {
  const { selectedSeason } = useSelectedSeason();
  const { data, isPending } = useNegotiationWindowStatus(
    Boolean(selectedSeason),
  );

  if (!selectedSeason) return null;

  if (isPending) return <Skeleton className={'h-5 w-24 rounded-4xl'} />;

  const open = data?.open;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Badge
            variant={open ? 'secondary' : 'outline'}
            className={open ? 'gap-1.5 text-success' : 'gap-1.5'}
          >
            {open ? (
              <DoorOpenIcon className={'size-3.5'} />
            ) : (
              <DoorClosedIcon className={'size-3.5 text-muted-foreground'} />
            )}
            <span>{open ? 'Janela aberta' : 'Janela fechada'}</span>
          </Badge>
        }
      />

      <TooltipContent>
        {open
          ? `Aberta por ${open.openedBy.name} em ${formatDateTime(open.openedAt)}.`
          : 'Ninguém consegue criar transferências ou negociações diretas.'}
      </TooltipContent>
    </Tooltip>
  );
};
