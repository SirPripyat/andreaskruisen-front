import { createBrowserRouter } from 'react-router';
import { ImportScreen } from '@/features/admin/import/import-screen';
import { LeaguesScreen } from '@/features/admin/leagues/leagues-screen';
import { NationalitiesScreen } from '@/features/admin/nationalities/nationalities-screen';
import { NegotiationWindowScreen } from '@/features/admin/negotiation-window/negotiation-window-screen';
import { PlayersScreen } from '@/features/admin/players/players-screen';
import { SeasonsScreen } from '@/features/admin/seasons/seasons-screen';
import { TeamsScreen } from '@/features/admin/teams/teams-screen';
import { UsersScreen } from '@/features/admin/users/users-screen';
import { LoginScreen } from '@/features/auth/login-screen';
import { ProfileScreen } from '@/features/auth/profile-screen';
import { FavoritesScreen } from '@/features/season/favorites/favorites-screen';
import { TeamDetailScreen } from '@/features/season/team-detail/team-detail-screen';
import { HallOfFameScreen } from '@/features/season/tournaments/hall-of-fame-screen';
import { TournamentDetailScreen } from '@/features/season/tournaments/tournament-detail-screen';
import { TournamentsScreen } from '@/features/season/tournaments/tournaments-screen';
import { AppLayoutRoute } from './app-layout-route';
import { ClubsRoute } from './clubs-route';
import { ProtectedRoute, RequireRole, RequireSeason } from './guards';
import { HomeRoute } from './home-route';
import { RootLayout, RouteErrorBoundary } from './layouts';
import { PlayerDetailRoute } from './player-detail-route';
import { PlayersRoute } from './players-route';
import { TransfersRoute } from './transfers-route';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: 'login', element: <LoginScreen /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayoutRoute />,
            children: [
              {
                index: true,
                element: <HomeRoute />,
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
                  {
                    path: 'nationalities',
                    element: <NationalitiesScreen />,
                    handle: { breadcrumb: 'Nacionalidades' },
                  },
                  {
                    path: 'leagues',
                    element: <LeaguesScreen />,
                    handle: { breadcrumb: 'Ligas' },
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
                    element: <ClubsRoute />,
                    handle: { breadcrumb: 'Times' },
                  },
                  {
                    path: 'players/season',
                    element: <PlayersRoute />,
                    handle: { breadcrumb: 'Jogadores' },
                  },
                  {
                    path: 'players/:id',
                    element: <PlayerDetailRoute />,
                    handle: { breadcrumb: 'Jogador' },
                  },
                  {
                    path: 'clubs/:id',
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
                    path: 'hall-of-fame',
                    element: <HallOfFameScreen />,
                    handle: { breadcrumb: 'Hall da Fama' },
                  },
                  {
                    path: 'transfers',
                    element: <TransfersRoute />,
                    handle: { breadcrumb: 'Mercado' },
                  },
                  {
                    path: 'favorites',
                    element: <FavoritesScreen />,
                    handle: { breadcrumb: 'Favoritos' },
                  },
                  {
                    element: <RequireRole roles={['ADMIN']} />,
                    children: [
                      {
                        path: 'negotiation-window',
                        element: <NegotiationWindowScreen />,
                        handle: { breadcrumb: 'Janela de negociação' },
                      },
                    ],
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
