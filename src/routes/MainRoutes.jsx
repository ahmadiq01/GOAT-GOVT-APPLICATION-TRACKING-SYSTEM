import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import ErrorBoundary from './ErrorBoundary';

// pages (lazy-loaded)
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const FeedbackSubmission = Loadable(lazy(() => import('views/dashboard/Default/User/FeedbackeSubmisson')));

// Super Admin specific components
const SuperAdminDashboard = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/MainDashboardWrapper')));
const UserManagement = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ViewUserManagement')));
const NotificationCenter = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ViewNotificationCenter')));
const ApplicationManagement = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ApplicationManagement')));

// ==============================|| MAIN ROUTING ||============================== //
const MainRoutes = {
  path: '/app',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  errorElement: <ErrorBoundary />,
  children: [
    // Default redirect to dashboard when under main layout
    { index: true, element: <Navigate to="/app/dashboard" replace /> },

    // Dashboard
    { path: 'dashboard', element: <DashboardDefault /> },

    // Super Admin Routes
    { path: 'super-admin', element: <SuperAdminDashboard /> },
    { path: 'super-admin/dashboard', element: <SuperAdminDashboard /> },
    { path: 'super-admin/user-management', element: <UserManagement /> },
    { path: 'super-admin/notifications', element: <NotificationCenter /> },
    { path: 'super-admin/applications', element: <ApplicationManagement /> },

    // User routes
    { path: 'feedback', element: <FeedbackSubmission /> }
  ]
};

export default MainRoutes;


