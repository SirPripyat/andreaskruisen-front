import { cn } from 'cn';
import {
  ArrowLeftRightIcon,
  CheckIcon,
  ClockIcon,
  CoinsIcon,
  XIcon,
} from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui';
import { formatDateTime, formatNumber } from '@/lib';
import { useAcceptNegotiation, useRejectNegotiation } from '../hooks';
import type {
  Negotiation,
  NegotiationPlayerSummary,
  NegotiationSquadSummary,
} from '../types';
import { STATUS_LABELS, STATUS_SPINE_CLASS } from '../utils/negotiation-labels';
import { NegotiationClauseBadge } from './negotiation-clause-badge';
import { NegotiationStatusBadge } from './negotiation-status-badge';

type NegotiationCardProps = {
  negotiation: Negotiation;
  myTeamId: string | undefined;
};

export const NegotiationCard = ({
  negotiation,
  myTeamId,
}: NegotiationCardProps) => {
  const isTarget = negotiation.targetSquad.team.id === myTeamId;
  const isPending = negotiation.status === 'PENDING';

  const { mutate: accept, isPending: isAccepting } = useAcceptNegotiation();
  const { mutate: reject, isPending: isRejecting } = useRejectNegotiation();

  const counterpartySquad = isTarget
    ? negotiation.proposingSquad
    : negotiation.targetSquad;
  const directionLabel = isTarget ? 'Proposta de' : 'Proposta para';

  const myIncomingPlayers = isTarget
    ? negotiation.outgoingPlayers
    : negotiation.incomingPlayers;
  const myOutgoingPlayers = isTarget
    ? negotiation.incomingPlayers
    : negotiation.outgoingPlayers;

  const signedCoinAmount =
    negotiation.coinAmount === null
      ? null
      : isTarget
        ? negotiation.coinAmount
        : -negotiation.coinAmount;
  const hasCoinAmount = Boolean(signedCoinAmount);

  return (
    <div className={'flex overflow-hidden rounded-xl border bg-card shadow-xs'}>
      <div
        className={cn('w-1 shrink-0', STATUS_SPINE_CLASS[negotiation.status])}
      />

      <div className={'flex min-w-0 flex-1 flex-col gap-3.5 p-4'}>
        <div className={'flex flex-wrap items-start justify-between gap-2'}>
          <CounterpartyHeader
            squad={counterpartySquad}
            directionLabel={directionLabel}
          />

          <div className={'flex shrink-0 flex-col items-end gap-1.5'}>
            <NegotiationStatusBadge status={negotiation.status} />
            <span className={'font-mono text-muted-foreground text-xs'}>
              {formatDateTime(negotiation.createdAt)}
            </span>
          </div>
        </div>

        {(myOutgoingPlayers.length > 0 || myIncomingPlayers.length > 0) && (
          <div
            className={
              'grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-lg border bg-muted/40 p-3'
            }
          >
            <TradeSlot
              label={'Você recebe'}
              labelClassName={'text-success'}
              players={myIncomingPlayers}
              align={'start'}
            />
            <span
              className={
                'flex size-7 shrink-0 items-center justify-center rounded-full border bg-card text-primary'
              }
            >
              <ArrowLeftRightIcon className={'size-3.5'} />
            </span>
            <TradeSlot
              label={'Você envia'}
              labelClassName={'text-critical'}
              players={myOutgoingPlayers}
              align={'end'}
            />
          </div>
        )}

        {(hasCoinAmount || negotiation.clauses.length > 0) && (
          <div className={'flex flex-col gap-2'}>
            {hasCoinAmount && signedCoinAmount !== null && (
              <div className={'flex items-center gap-1.5 text-sm'}>
                <CoinsIcon className={'size-3.5 text-value'} />
                <span className={'text-muted-foreground'}>
                  {signedCoinAmount > 0 ? 'Você recebe' : 'Você paga'}
                </span>
                <span
                  className={cn(
                    'font-mono font-semibold tabular-nums',
                    signedCoinAmount > 0 ? 'text-success' : 'text-critical',
                  )}
                >
                  {signedCoinAmount > 0 ? '+' : '−'}
                  {formatNumber(Math.abs(signedCoinAmount))}
                </span>
                <span className={'text-muted-foreground'}>{'coins'}</span>
              </div>
            )}

            {negotiation.clauses.length > 0 && (
              <div className={'flex flex-wrap gap-1.5'}>
                {negotiation.clauses.map((clause) => (
                  <NegotiationClauseBadge key={clause.id} clause={clause} />
                ))}
              </div>
            )}
          </div>
        )}

        {isPending && isTarget && (
          <div className={'flex items-center gap-2 border-t pt-3'}>
            <Button
              size={'sm'}
              disabled={isAccepting || isRejecting}
              onClick={() =>
                accept(negotiation.id, {
                  onSuccess: () => toast.success('Negociação aceita.'),
                })
              }
            >
              <CheckIcon />
              {isAccepting ? 'Aceitando...' : 'Aceitar'}
            </Button>
            <Button
              size={'sm'}
              variant={'destructive'}
              disabled={isAccepting || isRejecting}
              onClick={() =>
                reject(negotiation.id, {
                  onSuccess: () => toast.success('Negociação rejeitada.'),
                })
              }
            >
              <XIcon />
              {isRejecting ? 'Rejeitando...' : 'Rejeitar'}
            </Button>
          </div>
        )}

        {isPending && !isTarget && (
          <p
            className={
              'flex items-center gap-1.5 border-t pt-3 text-muted-foreground text-xs'
            }
          >
            <ClockIcon className={'size-3.5 shrink-0 text-warning'} />
            {`Aguardando resposta de ${counterpartySquad.user.name}.`}
          </p>
        )}

        {!isPending && negotiation.resolvedAt && (
          <p
            className={cn(
              'border-t pt-3 font-mono text-xs',
              negotiation.status === 'ACCEPTED'
                ? 'text-success'
                : 'text-critical',
            )}
          >
            {`${STATUS_LABELS[negotiation.status]} em ${formatDateTime(negotiation.resolvedAt)}`}
          </p>
        )}
      </div>
    </div>
  );
};

const CounterpartyHeader = ({
  squad,
  directionLabel,
}: {
  squad: NegotiationSquadSummary;
  directionLabel: string;
}) => {
  return (
    <Link
      to={`/clubs/${squad.team.id}`}
      className={'group flex min-w-0 items-center gap-2.5'}
    >
      <span
        className={
          'flex size-9 shrink-0 items-center justify-center overflow-hidden bg-muted [clip-path:polygon(0_0,100%_0,100%_55%,50%_100%,0_55%)]'
        }
      >
        <img
          src={squad.team.crestUrl}
          alt={''}
          className={'size-full object-contain p-1'}
          onError={(event) => {
            event.currentTarget.style.visibility = 'hidden';
          }}
        />
      </span>
      <span className={'flex min-w-0 flex-col'}>
        <span
          className={
            'font-mono text-[10px] text-muted-foreground uppercase tracking-wide'
          }
        >
          {directionLabel}
        </span>
        <span
          className={
            'truncate font-display font-bold text-base uppercase leading-tight group-hover:underline'
          }
        >
          {squad.team.name}
        </span>
        <span className={'truncate text-muted-foreground text-xs'}>
          {squad.user.name}
        </span>
      </span>
    </Link>
  );
};

const TradeSlot = ({
  label,
  labelClassName,
  players,
  align,
}: {
  label: string;
  labelClassName: string;
  players: NegotiationPlayerSummary[];
  align: 'start' | 'end';
}) => {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-1.5',
        align === 'end' && 'items-end text-right',
      )}
    >
      <span
        className={cn(
          'font-mono text-[10px] uppercase tracking-wide',
          labelClassName,
        )}
      >
        {label}
      </span>

      {players.length > 0 ? (
        <div className={'flex flex-col gap-1.5'}>
          {players.map((player) => (
            <Link
              key={player.id}
              to={`/players/${player.id}`}
              className={cn(
                'flex min-w-0 items-center gap-2 hover:underline',
                align === 'end' && 'flex-row-reverse',
              )}
            >
              <Avatar>
                <AvatarImage src={player.photoUrl} alt={''} />
                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className={'truncate font-medium text-sm'}>
                {player.name}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <span className={'text-muted-foreground text-xs italic'}>
          {'Somente dinheiro'}
        </span>
      )}
    </div>
  );
};
