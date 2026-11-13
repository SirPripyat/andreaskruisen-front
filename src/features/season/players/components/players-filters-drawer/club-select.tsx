import { useTeam } from '@/features/admin/teams';
import { TeamCombobox } from '@/features/season/transfers';

type ClubSelectProps = {
  value: string;
  onValueChange: (clubId: string) => void;
};

export const ClubSelect = ({ value, onValueChange }: ClubSelectProps) => {
  const { data: selectedClub } = useTeam(value || undefined);

  return (
    <TeamCombobox
      value={selectedClub ?? null}
      onValueChange={(team) => onValueChange(team?.id ?? '')}
      placeholder={'Buscar clube...'}
    />
  );
};
