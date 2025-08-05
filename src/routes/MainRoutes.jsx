import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ViewPackages from '../views/Admin/ViewPackages.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

// Dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default/index.jsx')));

// Utility routing
const UtilsTypography = Loadable(lazy(() => import('../views/utilities/Typography.jsx')));
const UtilsColor = Loadable(lazy(() => import('../views/utilities/Color.jsx')));
const UtilsShadow = Loadable(lazy(() => import('../views/utilities/Shadow.jsx')));

// ==============================|| MAIN ROUTING ||============================== //
const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  errorElement: <ErrorBoundary />,
  children: [
    {
      path: '/',
      element: <Navigate to="/login" replace /> // Redirect root to login
    },
    {
      path: '/dashboard',
      element: <ProtectedRoute><DashboardDefault/></ProtectedRoute>
    },
    {
      path: '/ViewPackages',
      element: <ProtectedRoute><ViewPackages/></ProtectedRoute>
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <ProtectedRoute><DashboardDefault /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'typography',
      element: <ProtectedRoute><UtilsTypography /></ProtectedRoute>
    },
    {
      path: 'color',
      element: <ProtectedRoute><UtilsColor /></ProtectedRoute>
    },
    {
      path: 'shadow',
      element: <ProtectedRoute><UtilsShadow /></ProtectedRoute>
    }
  ]
};

export default MainRoutes;