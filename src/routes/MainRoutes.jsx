import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import UserManagement from '../views/users/users';
import ViewPackages from '../views/ViewPackages/ViewPackages.jsx';
import PackagesManagement from '../views/packages-management/packages';
import OrdersManagement from '../views/orders/orders.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import NotificationsManagement from '../views/notifications/notifications';
import AdminManagement from '../views/admin/admin';
import OrderLogs from '../views/orderlogs/orderlogs.jsx';

// Dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// Utility routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// Sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

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
      path: '/users',
      element: <ProtectedRoute><UserManagement /></ProtectedRoute>
    },
    {
      path: '/ViewPackages',
      element: <ProtectedRoute><ViewPackages/></ProtectedRoute>
    },
    {
      path: '/orders',
      element: <ProtectedRoute><OrdersManagement /></ProtectedRoute>
    },
    {
      path: '/order-logs',
      element: <ProtectedRoute><OrderLogs /></ProtectedRoute>
    },
    {
      path: '/assets',
      element: <ProtectedRoute><NotificationsManagement /></ProtectedRoute>
    },
    {
      path: '/admin',
      element: <ProtectedRoute><AdminManagement /></ProtectedRoute>
    },
    {
      path: '/packages-management',
      element: <ProtectedRoute><PackagesManagement /></ProtectedRoute>
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
    },
    {
      path: '/sample-page',
      element: <ProtectedRoute><SamplePage /></ProtectedRoute>
    }
  ]
};

export default MainRoutes;