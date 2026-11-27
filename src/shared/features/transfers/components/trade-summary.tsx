import { ArrowLeftRightIcon, CoinsIcon, TicketPercentIcon } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Label,
  Switch,
} from '@/components/ui';
import type { TeamWithRatings } from '@/features/admin/teams';
import type { RosterPlayer } from '@/features/season/squads';
import { formatNumber, getErrorMessage } from '@/lib';
import type { TransferQuote } from '../types';

type TradeSummaryProps = {
  outgoingTeam: TeamWithRatings | null;
  outgoingPlayers: RosterPlayer[];
  incomingTeam: TeamWithRatings | null;
  incomingPlayers: RosterPlayer[];
  quote: TransferQuote | undefined;
  isQuotePending: boolean;
  quoteError: unknown;
  useCoupon: boolean;
  onUseCouponChange: (checked: boolean) => void;
};

export const TradeSummary = ({
  outgoingTeam,
  outgoingPlayers,
  incomingTeam,
  incomingPlayers,
  quote,
  isQuotePending,
  quoteError,
  useCoupon,
  onUseCouponChange,
}: TradeSummaryProps) => {
  if (!outgoingTeam) {
    return (
      <p className={'text-muted-foreground text-sm'}>
        {'Escolha o time de saída para começar.'}
      </p>
    );
  }

  if (outgoingPlayers.length === 0) {
    return (
      <p className={'text-muted-foreground text-sm'}>
        {`Escolha o jogador que vai sair do ${outgoingTeam.name}.`}
      </p>
    );
  }

  if (!incomingTeam) {
    return (
      <p className={'text-muted-foreground text-sm'}>
        {'Agora escolha o time de destino.'}
      </p>
    );
  }

  if (incomingPlayers.length === 0) {
    return (
      <p className={'text-muted-foreground text-sm'}>
        {`Escolha o jogador que vai entrar no ${incomingTeam.name}.`}
      </p>
    );
  }

  return (
    <div className={'flex min-w-0 flex-col gap-1.5'}>
      <div className={'flex min-w-0 items-center gap-2 text-sm'}>
        <PlayerChipGroup players={outgoingPlayers} />
        <ArrowLeftRightIcon className={'size-3.5 shrink-0 text-primary'} />
        <PlayerChipGroup players={incomingPlayers} />
      </div>

      {isQuotePending && (
        <p className={'text-muted-foreground text-xs'}>
          {'Calculando custo...'}
        </p>
      )}

      {!isQuotePending && Boolean(quoteError) && (
        <p className={'text-destructive text-xs'}>
          {getErrorMessage(quoteError, 'Não foi possível calcular o custo.')}
        </p>
      )}

      {!isQuotePending && quote && (
        <>
          <div className={'flex items-center gap-2'}>
            <Badge
              variant={quote.sufficientBalance ? 'secondary' : 'destructive'}
              className={'gap-1.5'}
            >
              <CoinsIcon className={'size-3.5'} />
              {`Custo: ${formatNumber(quote.cost)} coins`}
            </Badge>

            {!quote.sufficientBalance && (
              <span className={'text-destructive text-xs'}>
                {`Saldo insuficiente (${formatNumber(quote.balance)} coins)`}
              </span>
            )}
          </div>

          <div className={'flex items-center gap-2'}>
            <Switch
              id={'use-coupon'}
              checked={useCoupon}
              onCheckedChange={onUseCouponChange}
              disabled={quote.couponBalance === 0 && !useCoupon}
            />
            <Label
              htmlFor={'use-coupon'}
              className={'flex items-center gap-1.5 text-xs'}
            >
              <TicketPercentIcon className={'size-3.5 text-muted-foreground'} />
              {`Usar cupom de isenção (${quote.couponBalance} disponíveis)`}
            </Label>
          </div>
        </>
      )}
    </div>
  );
};

const PlayerChipGroup = ({ players }: { players: RosterPlayer[] }) => {
  return (
    <span className={'flex min-w-0 flex-col gap-1'}>
      {players.map((player) => (
        <span key={player.id} className={'flex min-w-0 items-center gap-1.5'}>
          <Avatar size={'sm'}>
            <AvatarImage src={player.photoUrl} alt={''} />
            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className={'truncate font-medium'}>{player.name}</span>
        </span>
      ))}
    </span>
  );
};
