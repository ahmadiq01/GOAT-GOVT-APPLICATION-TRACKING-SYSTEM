import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ViewPackages from '../views/Admin/ViewPackages.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// Dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// Utility routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// ==============================|| MAIN ROUTING ||============================== //
const MainRoutes = {
  path: '/',
  element: <MainLayout />,
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
      path: '/orders',
      element: <ProtectedRoute><div>Orders Management Page - Coming Soon</div></ProtectedRoute>
    },
    {
      path: '/assets',
      element: <ProtectedRoute><div>Notifications Management Page - Coming Soon</div></ProtectedRoute>
    },
    {
      path: '/packages-management',
      element: <ProtectedRoute><div>Packages Management Page - Coming Soon</div></ProtectedRoute>
    },
    {
      path: '/my-applications',
      element: <ProtectedRoute><div>My Applications Page - Coming Soon</div></ProtectedRoute>
    },
    {
      path: '/my-orders',
      element: <ProtectedRoute><div>My Orders Page - Coming Soon</div></ProtectedRoute>
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