import { Badge } from '@/components/ui';
import type { TransferOriginType } from '../types';

const ORIGIN_LABEL: Record<TransferOriginType, string> = {
  MARKET: 'Mercado',
  NEGOTIATION: 'Negociação',
};

export const TransferOriginBadge = ({
  originType,
  className,
}: {
  originType: TransferOriginType;
  className?: string;
}) => (
  <Badge
    variant={originType === 'MARKET' ? 'secondary' : 'outline'}
    className={className}
  >
    {ORIGIN_LABEL[originType]}
  </Badge>
);
