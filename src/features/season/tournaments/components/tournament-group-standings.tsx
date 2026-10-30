import { useState } from 'react';
import { useParams } from 'react-router';
import { Switch } from '@/components/ui';
import { useTournamentSituation } from '../hooks';
import { GroupStandingsTable } from './group-standings-table';

const GROUP_PHASE_ORDER = 1;

export const TournamentGroupStandings = () => {
  const { id } = useParams<{ id: string }>();

  const [onlyOwnedTeams, setOnlyOwnedTeams] = useState(false);

  const { data: groupSituation } = useTournamentSituation(id, {
    onlyOwnedTeams,
    round: GROUP_PHASE_ORDER,
  });

  const entries = Object.entries(groupSituation?.groups ?? {}).sort(
    ([a], [b]) => a.localeCompare(b),
  );

  if (entries.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm">
        Nenhuma fase de grupos ativa neste torneio.
      </p>
    );
  }

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex flex-wrap items-center justify-between gap-2'}>
        <span className={'font-medium text-muted-foreground text-xs uppercase'}>
          Classificação final · fase de grupos
        </span>

        <div className={'flex items-center gap-2'}>
          <label
            htmlFor={'only-owned-teams'}
            className={'text-muted-foreground text-sm'}
          >
            Somente times de usuários
          </label>
          <Switch
            id="only-owned-teams"
            checked={onlyOwnedTeams}
            onCheckedChange={setOnlyOwnedTeams}
          />
        </div>
      </div>

      <div className={'grid gap-4 md:grid-cols-2'}>
        {entries.map(([groupLabel, standings]) => (
          <div
            key={groupLabel}
            className={'w-full overflow-hidden rounded-xl border bg-card'}
          >
            <div
              className={
                'flex items-center gap-2 border-b bg-muted/40 px-4 py-3'
              }
            >
              <span className={'font-display font-bold text-base uppercase'}>
                Grupo {groupLabel}
              </span>
            </div>
            <div className={'overflow-x-auto px-4 py-2'}>
              <GroupStandingsTable
                standings={standings}
                showQualifyZone={true}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
