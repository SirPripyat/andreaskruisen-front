import { NegotiationWindowBanner } from '@/features/admin/negotiation-window';
import {
  DashboardMarketCard,
  DashboardMyTeamCard,
  DashboardNegotiationsCard,
  DashboardSeasonPicker,
  DashboardSquadCard,
  DashboardTournamentCard,
  Greeting,
  useDashboard,
} from '@/shared/features/home';

export const HomeScreen = () => {
  const {
    hasSeason,
    hasTeam,
    seasons,
    isSeasonsPending,
    selectSeason,
    isSelectingSeason,
    windowStatus,
    isWindowStatusPending,
    team,
    isTeamPending,
    roster,
    isRosterPending,
    receivedNegotiations,
    isNegotiationsPending,
    myTournaments,
    isTournamentsPending,
    transfers,
    isTransfersPending,
    user,
  } = useDashboard();

  if (!hasSeason) {
    return (
      <div className={'flex flex-1 flex-col gap-6'}>
        <DashboardSeasonPicker
          seasons={seasons}
          isPending={isSeasonsPending}
          onSelect={selectSeason}
          isSelecting={isSelectingSeason}
        />
      </div>
    );
  }

  return (
    <div className={'flex flex-1 flex-col gap-6'}>
      <Greeting />

      {!hasTeam ? (
        <p className={'text-muted-foreground text-sm'}>
          Você ainda não foi vinculado a um time nesta temporada. Peça pro admin
          te adicionar a uma equipe.
        </p>
      ) : (
        <>
          <NegotiationWindowBanner
            data={windowStatus}
            isPending={isWindowStatusPending}
          />

          <div className={'grid gap-4 grid-cols-4'}>
            <DashboardMyTeamCard team={team} isPending={isTeamPending} />

            <DashboardNegotiationsCard
              negotiations={receivedNegotiations}
              isPending={isNegotiationsPending}
            />

            <DashboardSquadCard
              teamId={user?.teamId ?? undefined}
              roster={roster}
              isPending={isRosterPending}
            />

            <DashboardTournamentCard
              tournaments={myTournaments}
              teamId={user?.teamId ?? undefined}
              isPending={isTournamentsPending}
            />

            <DashboardMarketCard
              teamId={user?.teamId ?? undefined}
              transfers={transfers}
              windowStatus={windowStatus}
              isPending={isTransfersPending}
            />
          </div>
        </>
      )}
    </div>
  );
};
