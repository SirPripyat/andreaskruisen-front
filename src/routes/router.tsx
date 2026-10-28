import { createBrowserRouter } from 'react-router';
import {
  HomeScreen,
  ImportPlayersScreen,
  LoginScreen,
  PlayersScreen,
  SeasonsScreen,
  TeamDetailScreen,
  TeamsScreen,
  TournamentDetailScreen,
  TournamentsScreen,
  UsersScreen,
} from '@/features';
import { AppLayout } from './app-layout';
import { ProtectedRoute } from './protected-route';
import { RootLayout } from './root-layout';

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
                path: 'players/import',
                element: <ImportPlayersScreen />,
                handle: { breadcrumb: 'Importar jogadores' },
              },
              {
                path: 'teams',
                element: <TeamsScreen />,
                handle: { breadcrumb: 'Dados de times' },
              },
              {
                path: 'teams/:id',
                element: <TeamDetailScreen />,
                handle: { breadcrumb: 'Time' },
              },
              {
                path: 'seasons',
                element: <SeasonsScreen />,
                handle: { breadcrumb: 'Temporadas' },
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
            ],
          },
        ],
      },
    ],
  },
]);
