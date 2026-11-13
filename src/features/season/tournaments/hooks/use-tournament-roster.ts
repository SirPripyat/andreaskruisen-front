import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import type { TeamWithRatings } from '@/features/admin/teams';
import { assignSquad, type SeasonSquad } from '@/features/season/squads';
import { queryKeys } from '@/lib';
import type { SelectedTeamEntry } from '../components/select-tournament-teams';

export const useTournamentRoster = () => {
  const queryClient = useQueryClient();
  const [selectedTeams, setSelectedTeams] = useState<
    Map<string, SelectedTeamEntry>
  >(new Map());
  const [isLinkingTeams, setIsLinkingTeams] = useState(false);
  const hasSeededSquadsRef = useRef(false);
  const preexistingSquadsRef = useRef<Set<string>>(new Set());

  // Chamado pelo próprio RosterStep quando ele busca o elenco atual da
  // temporada — como esse componente só monta no step 3, a busca e a semeadura
  // só acontecem quando o usuário de fato chega lá. O ref garante que, se o
  // usuário voltar e revisitar o step, não sobrescrevemos edições já feitas.
  const seedFromSquads = (squads: SeasonSquad[]) => {
    if (hasSeededSquadsRef.current || squads.length === 0) return;
    hasSeededSquadsRef.current = true;
    preexistingSquadsRef.current = new Set(
      squads.map((squad) => `${squad.teamId}:${squad.userId}`),
    );
    setSelectedTeams(
      new Map(
        squads.map((squad) => [
          squad.teamId,
          {
            team: {
              id: squad.team.id,
              name: squad.team.name,
              crestUrl: squad.team.crestUrl,
              league: { ...squad.team.league, logoUrl: '' },
              formation: null,
              averageOverallRating: null,
              averageDefenseRating: null,
              averageMidfieldRating: null,
              averageAttackRating: null,
            },
            ownerId: squad.userId,
          },
        ]),
      ),
    );
  };

  const selectTeam = (team: TeamWithRatings) => {
    setSelectedTeams((current) => new Map(current).set(team.id, { team }));
  };

  const removeTeam = (teamId: string) => {
    setSelectedTeams((current) => {
      const next = new Map(current);
      next.delete(teamId);
      return next;
    });
  };

  const changeOwner = (teamId: string, ownerId: string | undefined) => {
    setSelectedTeams((current) => {
      const entry = current.get(teamId);
      if (!entry) {
        return current;
      }
      return new Map(current).set(teamId, { ...entry, ownerId });
    });
  };

  const linkOwners = (seasonId: string, entries: SelectedTeamEntry[]) => {
    const ownerEntries = entries.filter(
      (entry) =>
        entry.ownerId &&
        !preexistingSquadsRef.current.has(`${entry.team.id}:${entry.ownerId}`),
    );

    if (ownerEntries.length === 0) return Promise.resolve();

    setIsLinkingTeams(true);

    return Promise.allSettled(
      ownerEntries.map((entry) =>
        assignSquad(seasonId, {
          userId: entry.ownerId as string,
          teamId: entry.team.id,
        }),
      ),
    ).then((ownerResults) => {
      setIsLinkingTeams(false);

      queryClient.invalidateQueries({ queryKey: queryKeys.squads });

      const ownerFailures = ownerResults.filter((r) => r.status === 'rejected');
      if (ownerFailures.length > 0) {
        toast.error(
          `${ownerFailures.length} dono${ownerFailures.length === 1 ? '' : 's'} de time não ${ownerFailures.length === 1 ? 'pôde' : 'puderam'} ser vinculado${ownerFailures.length === 1 ? '' : 's'}.`,
        );
      }
    });
  };

  const resetRoster = () => {
    setSelectedTeams(new Map());
    hasSeededSquadsRef.current = false;
    preexistingSquadsRef.current = new Set();
  };

  return {
    selectedTeams,
    selectTeam,
    removeTeam,
    changeOwner,
    linkOwners,
    isLinkingTeams,
    resetRoster,
    seedFromSquads,
  };
};
