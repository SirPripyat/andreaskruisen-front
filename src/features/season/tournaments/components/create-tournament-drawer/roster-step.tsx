import { useEffect } from 'react';
import { Field, FieldError, FieldLabel } from '@/components';
import type { TeamWithRatings } from '@/features/admin/teams';
import { type SeasonSquad, useSeasonSquads } from '@/features/season/squads';
import {
  type SelectedTeamEntry,
  SelectTournamentTeams,
} from '../select-tournament-teams';

type RosterStepProps = {
  selectedTeams: Map<string, SelectedTeamEntry>;
  onSelect: (team: TeamWithRatings) => void;
  onRemove: (teamId: string) => void;
  onOwnerChange: (teamId: string, ownerId: string | undefined) => void;
  onSeed: (squads: SeasonSquad[]) => void;
  maxTeams: number | undefined;
  isMismatch: boolean;
};

export const RosterStep = ({
  selectedTeams,
  onSelect,
  onRemove,
  onOwnerChange,
  onSeed,
  maxTeams,
  isMismatch,
}: RosterStepProps) => {
  const { data: seasonSquads } = useSeasonSquads();

  useEffect(() => {
    if (seasonSquads) onSeed(seasonSquads);
  }, [seasonSquads, onSeed]);

  return (
    <Field>
      <FieldLabel>Elenco</FieldLabel>
      <SelectTournamentTeams
        selectedTeams={selectedTeams}
        onSelect={onSelect}
        onRemove={onRemove}
        onOwnerChange={onOwnerChange}
        maxTeams={maxTeams}
        canAssignOwners={true}
      />
      {isMismatch && (
        <FieldError>
          Selecione exatamente {maxTeams} time{maxTeams === 1 ? '' : 's'}{' '}
          (atualmente {selectedTeams.size}).
        </FieldError>
      )}
    </Field>
  );
};
