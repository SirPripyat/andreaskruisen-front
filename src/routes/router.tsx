import { createBrowserRouter } from 'react-router';
import {
  HomeScreen,
  ImportScreen,
  LoginScreen,
  PlayersScreen,
  SeasonsScreen,
  TeamDetailScreen,
  TeamsScreen,
  TournamentDetailScreen,
  TournamentsScreen,
  TransfersScreen,
  UsersScreen,
} from '@/features';
import { AppLayout } from './app-layout';
import { ProtectedRoute } from './protected-route';
import { RequireSeason } from './require-season';
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
                path: 'seasons',
                element: <SeasonsScreen />,
                handle: { breadcrumb: 'Temporadas' },
              },
              {
                element: <RequireSeason />,
                children: [
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
