import { DoorClosedIcon, TicketPercentIcon } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { NegotiationWindowStatus } from '../types';

type NegotiationWindowBannerProps = {
  data?: NegotiationWindowStatus;
  isPending?: boolean;
};

export const NegotiationWindowBanner = ({
  data,
  isPending,
}: NegotiationWindowBannerProps) => {
  if (isPending) return null;

  if (!data?.open) {
    return (
      <div
        className={
          'flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-destructive text-sm'
        }
      >
        <DoorClosedIcon className={'size-4 shrink-0'} />A janela de negociação
        está fechada. Peça pro admin abrir pra criar transferências ou
        negociações.
      </div>
    );
  }

  return (
    <Badge variant={'outline'} className={'gap-1.5'}>
      <TicketPercentIcon className={'size-3.5'} />
      {data.open.feeEnabled
        ? 'Janela aberta — taxa de negociação ativada'
        : 'Janela aberta — sem taxa de negociação'}
    </Badge>
  );
};
