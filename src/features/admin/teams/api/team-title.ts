// Mesmos valores de TournamentFormat (ver src/features/tournaments/api) —
// duplicado aqui pra não criar um import cruzado entre as camadas de api
// dos dois features, só pra um union de 3 valores.
export type TeamTitle = {
  tournamentId: string;
  tournamentName: string;
  format: 'GROUP_STAGE' | 'KNOCKOUT' | 'GROUP_STAGE_KNOCKOUT';
  seasonId: string;
  seasonName: string;
};
