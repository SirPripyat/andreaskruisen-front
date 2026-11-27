import type { ReactNode } from 'react';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { OverallRatingBadge } from '@/components';
import { Badge, FieldError as FieldErrorText } from '@/components/ui';
import type { TeamWithRatings } from '@/features/admin/teams';
import type { RosterBySector } from '@/features/season/squads';
import { cn } from '@/lib';
import { PlayerOption } from '@/shared/features/transfers';
import type { CreateNegotiationFormValues } from '../types';

const MAX_PLAYERS_PER_SIDE = 2;

const togglePlayerId = (selectedIds: string[], playerId: string) => {
  if (selectedIds.includes(playerId)) {
    return selectedIds.filter((id) => id !== playerId);
  }
  if (selectedIds.length >= MAX_PLAYERS_PER_SIDE) {
    toast.error(`Máximo de ${MAX_PLAYERS_PER_SIDE} jogadores por lado.`);
    return selectedIds;
  }
  return [...selectedIds, playerId];
};

const SECTOR_LABELS: Record<keyof RosterBySector, string> = {
  goalkeepers: 'Goleiros',
  defenders: 'Defensores',
  midfielders: 'Meio-campistas',
  attackers: 'Atacantes',
};

const SECTOR_ORDER: (keyof RosterBySector)[] = [
  'goalkeepers',
  'defenders',
  'midfielders',
  'attackers',
];

type NegotiationSidePanelProps = {
  title: string;
  tagLabel: string;
  tagClassName: string;
  hint: string;
  team: TeamWithRatings | null;
  // Só o painel do time de destino recebe um seletor — o meu lado é sempre
  // o time do técnico logado (ver DirectNegotiationForm). Quando
  // presente, substitui o nome estático do time.
  picker?: ReactNode;
  roster: RosterBySector | undefined;
  isRosterPending: boolean;
  control: Control<CreateNegotiationFormValues>;
  name: 'outgoingPlayerIds' | 'incomingPlayerIds';
  error: { message?: string } | undefined;
};

export const NegotiationSidePanel = ({
  title,
  tagLabel,
  tagClassName,
  hint,
  team,
  picker,
  roster,
  isRosterPending,
  control,
  name,
  error,
}: NegotiationSidePanelProps) => {
  const sectors = SECTOR_ORDER.filter((sector) => roster?.[sector]?.length);

  return (
    <div
      className={
        'flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-3 sm:h-full sm:min-h-0'
      }
    >
      <div className={'flex items-center justify-between gap-2'}>
        <span className={'font-display font-semibold text-base'}>{title}</span>
        <Badge
          variant={'outline'}
          className={cn('border-transparent', tagClassName)}
        >
          {tagLabel}
        </Badge>
      </div>

      {picker ?? (
        <div className={'font-display font-semibold text-sm'}>
          {team?.name ?? '—'}
        </div>
      )}

      {team && (
        <div
          className={
            'flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-2 text-muted-foreground text-xs'
          }
        >
          <span className={'font-display font-semibold text-foreground'}>
            {team.formation ?? '—'}
          </span>
          <span>{'·'}</span>
          <span className={'truncate'}>{team.league.name}</span>
          <span className={'ml-auto'}>
            <OverallRatingBadge rating={team.averageOverallRating} />
          </span>
        </div>
      )}

      <p className={'text-muted-foreground text-xs'}>{hint}</p>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div
            className={
              'flex min-h-56 flex-col gap-3 overflow-y-auto pr-1 sm:min-h-0 sm:flex-1'
            }
          >
            {!team && (
              <div
                className={
                  'flex flex-1 items-center justify-center rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm'
                }
              >
                Escolha um time para ver o elenco disponível.
              </div>
            )}

            {team && isRosterPending && (
              <div
                className={
                  'flex flex-1 items-center justify-center p-6 text-center text-muted-foreground text-sm'
                }
              >
                {'Carregando elenco...'}
              </div>
            )}

            {team && !isRosterPending && sectors.length === 0 && (
              <div
                className={
                  'flex flex-1 items-center justify-center rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm'
                }
              >
                {'Nenhum jogador disponível neste time.'}
              </div>
            )}

            {sectors.map((sector) => (
              <div key={sector} className={'flex flex-col gap-1.5'}>
                <span
                  className={
                    'font-mono text-[11px] text-muted-foreground uppercase tracking-wide'
                  }
                >
                  {SECTOR_LABELS[sector]}
                </span>
                <div className={'flex flex-col gap-1.5'}>
                  {roster?.[sector].map((player) => (
                    <PlayerOption
                      key={player.id}
                      player={player}
                      selected={field.value.includes(player.id)}
                      onSelect={() =>
                        field.onChange(togglePlayerId(field.value, player.id))
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      />

      <FieldErrorText errors={error ? [error] : undefined} />
    </div>
  );
};
