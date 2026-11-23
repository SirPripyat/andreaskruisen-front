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
import { HomeScreen } from '@/features/home/home-screen';
import { ClubsScreen } from '@/features/season/clubs/clubs-screen';
import { FavoritesScreen } from '@/features/season/favorites/favorites-screen';
import { PlayerDetailScreen } from '@/features/season/players/player-detail-screen';
import { SeasonPlayersScreen } from '@/features/season/players/players-screen';
import { TeamDetailScreen } from '@/features/season/team-detail/team-detail-screen';
import { HallOfFameScreen } from '@/features/season/tournaments/hall-of-fame-screen';
import { TournamentDetailScreen } from '@/features/season/tournaments/tournament-detail-screen';
import { TournamentsScreen } from '@/features/season/tournaments/tournaments-screen';
import { TransfersScreen } from '@/features/season/transfers/transfers-screen';
import { ProtectedRoute, RequireRole, RequireSeason } from './guards';
import { AppLayout, RootLayout, RouteErrorBoundary } from './layouts';

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
                    element: <TransfersScreen />,
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
