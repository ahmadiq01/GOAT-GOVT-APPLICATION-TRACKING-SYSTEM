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
const ApplicationDetails = Loadable(lazy(() => import('views/dashboard/Default/User/ApplicationDetails')));
const UserDashboard = Loadable(lazy(() => import('views/dashboard/Default/User/user')));

// Admin specific components
const AdminMain = Loadable(lazy(() => import('views/dashboard/Default/Admin/admin')));
const ApplicationDetail = Loadable(lazy(() => import('views/dashboard/Default/Admin/ApplicationDetail')));

// Super Admin specific components
const SuperAdminMain = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/superadmin')));
const UserManagement = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ViewUserManagement')));
const ApplicationManagement = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ApplicationManagement')));
const ViewApplicationsTable = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ViewApplicationsTable')));
const ViewApplicationsList = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ViewApplicationsList')));
const ViewApplicationsFilterSection = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ViewApplicationsFilterSection')));

// User specific components  
const UserMain = Loadable(lazy(() => import('views/dashboard/Default/User/user')));

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

    // Admin Routes
    { path: 'admin', element: <AdminMain /> },
    { path: 'admin/main', element: <AdminMain /> },
    { path: 'admin/application-detail', element: <ApplicationDetail /> },

    // Super Admin Routes
    { path: 'super-admin', element: <SuperAdminMain /> },
    { path: 'super-admin/main', element: <SuperAdminMain /> },
    { path: 'super-admin/user-management', element: <UserManagement /> },
    { path: 'super-admin/applications', element: <ApplicationManagement /> },
    { path: 'super-admin/applications-table', element: <ViewApplicationsTable /> },
    { path: 'super-admin/applications-list', element: <ViewApplicationsList /> },
    { path: 'super-admin/applications-filter', element: <ViewApplicationsFilterSection /> },

    // User routes
    { path: 'user', element: <UserMain /> },
    { path: 'user-dashboard', element: <UserDashboard /> },
    { path: 'feedback', element: <FeedbackSubmission /> },
    { path: 'feedback-submission', element: <FeedbackSubmission /> },
    { path: 'ApplicationDetails', element: <ApplicationDetails /> }
  ]
};

export default MainRoutes;