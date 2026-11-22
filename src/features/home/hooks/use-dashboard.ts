import { useNegotiationWindowStatus } from '@/features/admin/negotiation-window';
import {
  useSeasons,
  useSelectedSeason,
  useSelectSeason,
} from '@/features/admin/seasons';
import { useClub } from '@/features/season/clubs';
import { useNegotiations } from '@/features/season/negotiations';
import { useRoster } from '@/features/season/squads';
import { useMyTournaments } from '@/features/season/tournaments';
import { useTransfers } from '@/features/season/transfers';
import { useUserStore } from '@/stores';

export const useDashboard = () => {
  const user = useUserStore((state) => state.user);
  const { selectedSeason, isPending: isSeasonPending } = useSelectedSeason();

  const hasSeason = Boolean(selectedSeason);
  const teamId = user?.teamId ?? undefined;

  const { data: seasons, isPending: isSeasonsPending } = useSeasons();
  const { mutate: selectSeason, isPending: isSelectingSeason } =
    useSelectSeason();

  const { data: windowStatus, isPending: isWindowStatusPending } =
    useNegotiationWindowStatus(hasSeason);

  const { data: team, isPending: isTeamPending } = useClub(teamId, hasSeason);

  const { data: roster, isPending: isRosterPending } = useRoster(
    teamId,
    hasSeason,
  );

  const { data: receivedNegotiations, isPending: isNegotiationsPending } =
    useNegotiations({ direction: 'received' }, hasSeason);

  const { data: myTournaments, isPending: isTournamentsPending } =
    useMyTournaments(hasSeason);

  const { data: transfers, isPending: isTransfersPending } =
    useTransfers(hasSeason);

  return {
    user,
    selectedSeason,
    isSeasonPending,
    hasSeason,
    hasTeam: Boolean(teamId),
    seasons: seasons ?? [],
    isSeasonsPending,
    selectSeason,
    isSelectingSeason,
    windowStatus,
    isWindowStatusPending,
    team,
    isTeamPending,
    roster,
    isRosterPending,
    receivedNegotiations: receivedNegotiations ?? [],
    isNegotiationsPending,
    myTournaments: myTournaments ?? [],
    isTournamentsPending,
    transfers: transfers ?? [],
    isTransfersPending,
  };
};
