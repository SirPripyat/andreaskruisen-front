import { createBrowserRouter } from 'react-router';
import { HomeScreen, LoginScreen } from '@/features';
import { ProtectedRoute } from './protected-route';
import { RootLayout } from './root-layout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: 'login', element: <LoginScreen /> },
      {
        element: <ProtectedRoute />,
        children: [{ index: true, element: <HomeScreen /> }],
      },
    ],
  },
]);
