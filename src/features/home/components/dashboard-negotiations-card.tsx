import { ChevronRightIcon, ClockIcon, ShirtIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Card, Skeleton } from '@/components/ui';
import type { Negotiation } from '@/features/season/negotiations';
import { formatDateTime, formatNumber, pluralize } from '@/lib';

type DashboardNegotiationsCardProps = {
  negotiations: Negotiation[];
  isPending: boolean;
};

const describeOffer = (negotiation: Negotiation) => {
  const incomingPlayer = negotiation.outgoingPlayer?.name;
  const outgoingPlayer = negotiation.incomingPlayer?.name;

  const offerParts = [
    incomingPlayer,
    negotiation.coinAmount && negotiation.coinAmount > 0
      ? `${formatNumber(negotiation.coinAmount)} moedas`
      : null,
  ].filter(Boolean);

  const offer = offerParts.length > 0 ? offerParts.join(' + ') : 'uma proposta';
  const forPart = outgoingPlayer ? ` pelo seu ${outgoingPlayer}` : '';

  return `${negotiation.proposingSquad.team.name} oferece ${offer}${forPart}.`;
};

export const DashboardNegotiationsCard = ({
  negotiations,
  isPending,
}: DashboardNegotiationsCardProps) => {
  if (isPending) {
    return (
      <Card className={'col-span-2 gap-4 p-4'}>
        <Skeleton className={'h-6 w-48'} />
        <Skeleton className={'h-14 w-full'} />
        <Skeleton className={'h-14 w-full'} />
      </Card>
    );
  }

  const pending = negotiations.filter(
    (negotiation) => negotiation.status === 'PENDING',
  );

  return (
    <Card className={'col-span-2 gap-4 p-4'}>
      <div className={'flex items-start justify-between gap-2'}>
        <div>
          <div className={'flex items-center gap-2 font-semibold text-sm'}>
            <ShirtIcon className={'size-4 text-accent'} />
            Negociações recebidas
          </div>
          <p className={'text-muted-foreground text-xs'}>
            Propostas de outros times aguardando sua resposta
          </p>
        </div>
        {pending.length > 0 && (
          <span
            className={
              'shrink-0 rounded-full bg-accent-surface px-2.5 py-0.5 font-semibold text-accent text-xs'
            }
          >
            {`${pending.length} ${pluralize(pending.length, 'pendente', 'pendentes')}`}
          </span>
        )}
      </div>

      {pending.length === 0 ? (
        <p className={'text-muted-foreground text-sm'}>
          Nenhuma proposta pendente no momento.
        </p>
      ) : (
        <div className={'flex flex-col'}>
          {pending.slice(0, 2).map((negotiation, index) => (
            <Link
              key={negotiation.id}
              to={'/transfers?tab=received'}
              className={`flex items-start gap-2.5 py-2.5 hover:underline ${index > 0 ? 'border-t' : ''}`}
            >
              <span
                className={
                  'flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted'
                }
              >
                <img
                  src={negotiation.proposingSquad.team.crestUrl}
                  alt={''}
                  className={'size-full object-contain p-1'}
                  onError={(event) => {
                    event.currentTarget.style.visibility = 'hidden';
                  }}
                />
              </span>
              <div className={'flex min-w-0 flex-1 flex-col gap-1'}>
                <p className={'text-xs leading-snug'}>
                  {describeOffer(negotiation)}
                </p>
                <div className={'flex items-center gap-2'}>
                  <span
                    className={
                      'inline-flex items-center gap-1 rounded-full bg-warning-surface px-2 py-0.5 font-semibold text-[11px] text-warning'
                    }
                  >
                    <ClockIcon className={'size-2.5'} />
                    Pendente
                  </span>
                  <span
                    className={'font-mono text-[11px] text-muted-foreground'}
                  >
                    {formatDateTime(negotiation.createdAt)}
                  </span>
                </div>
              </div>
              <ChevronRightIcon
                className={
                  'size-3.5 shrink-0 self-center text-muted-foreground'
                }
              />
            </Link>
          ))}
        </div>
      )}

      <Link
        to={'/transfers?tab=received'}
        className={
          'flex items-center justify-between gap-2 border-t pt-3 font-semibold text-accent text-xs hover:underline'
        }
      >
        Ver todas as negociações
        <ChevronRightIcon className={'size-3.5'} />
      </Link>
    </Card>
  );
};
