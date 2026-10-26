import { createBrowserRouter } from 'react-router';
import {
  HomeScreen,
  LoginScreen,
  PlayersScreen,
  TeamsScreen,
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
                path: 'teams',
                element: <TeamsScreen />,
                handle: { breadcrumb: 'Dados de times' },
              },
            ],
          },
        ],
      },
    ],
  },
]);
