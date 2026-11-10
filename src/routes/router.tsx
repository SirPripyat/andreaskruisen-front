import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { AppLayout } from './app-layout';
import { ProtectedRoute } from './protected-route';
import { RequireRole } from './require-role';
import { RequireSeason } from './require-season';
import { RootLayout } from './root-layout';

const LoginScreen = lazy(() =>
  import('@/features/auth/login-screen').then((m) => ({
    default: m.LoginScreen,
  })),
);

const HomeScreen = lazy(() =>
  import('@/features/home/home-screen').then((m) => ({
    default: m.HomeScreen,
  })),
);

const UsersScreen = lazy(() =>
  import('@/features/admin/users/users-screen').then((m) => ({
    default: m.UsersScreen,
  })),
);

const PlayersScreen = lazy(() =>
  import('@/features/admin/players/players-screen').then((m) => ({
    default: m.PlayersScreen,
  })),
);

const ImportScreen = lazy(() =>
  import('@/features/admin/import/import-screen').then((m) => ({
    default: m.ImportScreen,
  })),
);

const TeamsScreen = lazy(() =>
  import('@/features/admin/teams/teams-screen').then((m) => ({
    default: m.TeamsScreen,
  })),
);

const SeasonsScreen = lazy(() =>
  import('@/features/admin/seasons/seasons-screen').then((m) => ({
    default: m.SeasonsScreen,
  })),
);

const TeamDetailScreen = lazy(() =>
  import('@/features/season/team-detail/team-detail-screen').then((m) => ({
    default: m.TeamDetailScreen,
  })),
);

const ClubsScreen = lazy(() =>
  import('@/features/season/clubs/clubs-screen').then((m) => ({
    default: m.ClubsScreen,
  })),
);

const TournamentsScreen = lazy(() =>
  import('@/features/season/tournaments/tournaments-screen').then((m) => ({
    default: m.TournamentsScreen,
  })),
);

const TournamentDetailScreen = lazy(() =>
  import('@/features/season/tournaments/tournament-detail-screen').then(
    (m) => ({ default: m.TournamentDetailScreen }),
  ),
);

const TransfersScreen = lazy(() =>
  import('@/features/season/transfers/transfers-screen').then((m) => ({
    default: m.TransfersScreen,
  })),
);

const SeasonPlayersScreen = lazy(() =>
  import('@/features/season/players/players-screen').then((m) => ({
    default: m.SeasonPlayersScreen,
  })),
);

const PlayerDetailScreen = lazy(() =>
  import('@/features/season/players/player-detail-screen').then((m) => ({
    default: m.PlayerDetailScreen,
  })),
);

const ProfileScreen = lazy(() =>
  import('@/features/auth/profile-screen').then((m) => ({
    default: m.ProfileScreen,
  })),
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: 'login', element: <LoginScreen /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                index: true,
                element: <HomeScreen />,
                handle: { breadcrumb: 'Dashboard' },
              },
              {
                path: 'profile',
                element: <ProfileScreen />,
                handle: { breadcrumb: 'Meu perfil' },
              },
              {
                element: <RequireRole roles={['ADMIN']} />,
                children: [
                  {
                    path: 'users',
                    element: <UsersScreen />,
                    handle: { breadcrumb: 'Usuários' },
                  },
                  {
                    path: 'players',
                    element: <PlayersScreen />,
                    handle: { breadcrumb: 'Dados de jogadores' },
                  },
                  {
                    path: 'import',
                    element: <ImportScreen />,
                    handle: { breadcrumb: 'Importações' },
                  },
                  {
                    path: 'teams',
                    element: <TeamsScreen />,
                    handle: { breadcrumb: 'Dados de times' },
                  },
                ],
              },
              {
                path: 'seasons',
                element: <SeasonsScreen />,
                handle: { breadcrumb: 'Temporadas' },
              },
              {
                element: <RequireSeason />,
                children: [
                  {
                    path: 'clubs',
                    element: <ClubsScreen />,
                    handle: { breadcrumb: 'Times' },
                  },
                  {
                    path: 'players/season',
                    element: <SeasonPlayersScreen />,
                    handle: { breadcrumb: 'Jogadores' },
                  },
                  {
                    path: 'players/:id',
                    element: <PlayerDetailScreen />,
                    handle: { breadcrumb: 'Jogador' },
                  },
                  {
                    path: 'teams/:id',
                    element: <TeamDetailScreen />,
                    handle: { breadcrumb: 'Time' },
                  },
                  {
                    path: 'tournaments',
                    element: <TournamentsScreen />,
                    handle: { breadcrumb: 'Torneios' },
                  },
                  {
                    path: 'tournaments/:id',
                    element: <TournamentDetailScreen />,
                    handle: { breadcrumb: 'Torneio' },
                  },
                  {
                    path: 'transfers',
                    element: <TransfersScreen />,
                    handle: { breadcrumb: 'Transferências' },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
