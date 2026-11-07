import type { Control, FieldError } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { OverallRatingBadge } from '@/components';
import {
  Badge,
  Field,
  FieldError as FieldErrorText,
  FieldLabel,
} from '@/components/ui';
import type { TeamWithRatings } from '@/features/admin/teams';
import type { RosterBySector } from '@/features/season/squads';
import { cn } from '@/lib';
import type { CreateTransferFormValues } from '../api';
import { PlayerOption } from './player-option';
import { TeamCombobox } from './team-combobox';

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

type TransferSidePanelProps = {
  title: string;
  tagLabel: string;
  tagClassName: string;
  team: TeamWithRatings | null;
  onTeamChange: (team: TeamWithRatings | null) => void;
  excludeTeamId: string | undefined;
  placeholder: string;
  roster: RosterBySector | undefined;
  isRosterPending: boolean;
  control: Control<CreateTransferFormValues>;
  name: 'outgoingPlayerId' | 'incomingPlayerId';
  error: FieldError | undefined;
};

export const TransferSidePanel = ({
  title,
  tagLabel,
  tagClassName,
  team,
  onTeamChange,
  excludeTeamId,
  placeholder,
  roster,
  isRosterPending,
  control,
  name,
  error,
}: TransferSidePanelProps) => {
  const sectors = SECTOR_ORDER.filter((sector) => roster?.[sector]?.length);

  return (
    <div
      className={'flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-3'}
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

      <Field>
        <FieldLabel>{'Time'}</FieldLabel>
        <TeamCombobox
          value={team}
          onValueChange={onTeamChange}
          excludeTeamId={excludeTeamId}
          placeholder={placeholder}
        />
      </Field>

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

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={'flex min-h-56 flex-col gap-3 overflow-y-auto pr-1'}>
            {!team && (
              <div
                className={
                  'flex flex-1 items-center justify-center rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm'
                }
              >
                {'Escolha um time para ver o elenco disponível.'}
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
                      selected={field.value === player.id}
                      onSelect={() => field.onChange(player.id)}
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
