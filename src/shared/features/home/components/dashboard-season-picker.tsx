import {
  ArrowLeftRightIcon,
  LockIcon,
  ShieldIcon,
  ShirtIcon,
  TrophyIcon,
  UserRoundIcon,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { Button, Card, Skeleton } from '@/components/ui';
import type { Season } from '@/features/admin/seasons';
import { formatDate } from '@/lib';

type DashboardSeasonPickerProps = {
  seasons: Season[];
  isPending: boolean;
  onSelect: (seasonId: string) => void;
  isSelecting: boolean;
};

export const DashboardSeasonPicker = ({
  seasons,
  isPending,
  onSelect,
  isSelecting,
}: DashboardSeasonPickerProps) => {
  return (
    <div className={'flex flex-col gap-6'}>
      <div className={'flex flex-col gap-1'}>
        <p
          className={
            'font-mono text-xs font-semibold tracking-wider text-accent uppercase'
          }
        >
          Dashboard
        </p>
        <h1
          className={
            'font-display text-3xl font-extrabold leading-none text-balance'
          }
        >
          Escolha sua temporada
        </h1>
        <p className={'max-w-2xl text-sm text-muted-foreground'}>
          Selecione uma temporada ativa para liberar elenco, time, torneio,
          mercado e negociações.
        </p>
      </div>

      {isPending ? (
        <div className={'flex max-w-md flex-col gap-2'}>
          <Skeleton className={'h-14 w-full'} />
          <Skeleton className={'h-14 w-full'} />
        </div>
      ) : seasons.length === 0 ? (
        <p className={'text-muted-foreground text-sm'}>
          Nenhuma temporada criada ainda. Peça pro admin criar uma.
        </p>
      ) : (
        <div className={'flex max-w-md flex-col gap-2'}>
          {seasons.map((season) => (
            <div
              key={season.id}
              className={
                'flex items-center justify-between gap-2.5 rounded-lg border bg-card p-3'
              }
            >
              <div>
                <p className={'font-semibold text-sm'}>{season.name}</p>
                <p className={'text-muted-foreground text-xs'}>
                  {season.isActive ? 'Em andamento' : 'Encerrada'}
                  {` · iniciada em ${formatDate(season.startedAt)}`}
                </p>
              </div>
              <Button
                size={'sm'}
                disabled={isSelecting}
                onClick={() => onSelect(season.id)}
              >
                Selecionar
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className={'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'}>
        <LockedCard icon={ShieldIcon} title={'Meu Time'} span />
        <LockedCard icon={ShirtIcon} title={'Negociações recebidas'} span />
        <LockedCard icon={UserRoundIcon} title={'Elenco'} />
        <LockedCard icon={TrophyIcon} title={'Torneio'} />
        <LockedCard icon={ArrowLeftRightIcon} title={'Mercado'} span />
      </div>
    </div>
  );
};

const LockedCard = ({
  icon: Icon,
  title,
  span,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  span?: boolean;
}) => {
  return (
    <Card
      className={`gap-3 border-dashed p-4 opacity-70 ${span ? 'sm:col-span-2' : ''}`}
    >
      <div className={'flex items-center justify-between gap-2'}>
        <div className={'flex items-center gap-2 font-semibold text-sm'}>
          <Icon className={'size-4 text-muted-foreground'} />
          {title}
        </div>
        <span
          className={
            'flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-semibold text-[10.5px] text-muted-foreground'
          }
        >
          <LockIcon className={'size-2.5'} />
          Bloqueado
        </span>
      </div>
      <Skeleton className={'h-2.5 w-2/5'} />
      <Skeleton className={'h-2.5 w-4/5'} />
      <Skeleton className={'h-2.5 w-3/5'} />
      <p className={'text-[11px] text-muted-foreground'}>
        Disponível após selecionar uma temporada.
      </p>
    </Card>
  );
};
