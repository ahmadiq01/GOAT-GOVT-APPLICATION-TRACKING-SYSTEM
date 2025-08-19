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
// const AdminDashboard = Loadable(lazy(() => import('views/dashboard/Default/Admin/AdminDashboardWrapper')));
// const AdminApplications = Loadable(lazy(() => import('views/dashboard/Default/Admin/AdminApplications')));
const ApplicationDetail = Loadable(lazy(() => import('views/dashboard/Default/Admin/ApplicationDetail')));
const AdminMain = Loadable(lazy(() => import('views/dashboard/Default/Admin/admin')));

// Super Admin specific components
// const SuperAdminDashboard = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/MainDashboardWrapper')));
const UserManagement = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ViewUserManagement')));
// const NotificationCenter = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ViewNotificationCenter')));
const ApplicationManagement = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ApplicationManagement')));
const ViewApplicationsTable = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ViewApplicationsTable')));
const ViewApplicationsList = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ViewApplicationsList')));
const ViewApplicationsFilterSection = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ViewApplicationsFilterSection')));
const SuperAdminMain = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/superadmin')));

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
    { path: 'admin', element: <AdminDashboard /> },
    { path: 'admin/dashboard', element: <AdminDashboard /> },
    { path: 'admin/applications', element: <AdminApplications /> },
    { path: 'admin/application-detail', element: <ApplicationDetail /> },
    { path: 'admin/main', element: <AdminMain /> },

    // Super Admin Routes
    { path: 'super-admin', element: <SuperAdminDashboard /> },
    { path: 'super-admin/dashboard', element: <SuperAdminDashboard /> },
    { path: 'super-admin/user-management', element: <UserManagement /> },
    { path: 'super-admin/notifications', element: <NotificationCenter /> },
    { path: 'super-admin/applications', element: <ApplicationManagement /> },
    { path: 'super-admin/applications-table', element: <ViewApplicationsTable /> },
    { path: 'super-admin/applications-list', element: <ViewApplicationsList /> },
    { path: 'super-admin/applications-filter', element: <ViewApplicationsFilterSection /> },
    { path: 'super-admin/main', element: <SuperAdminMain /> },

    // User routes
    { path: 'feedback', element: <FeedbackSubmission /> },
    { path: 'ApplicationDetails', element: <ApplicationDetails /> },
    { path: 'user-dashboard', element: <UserDashboard /> },
    { path: 'feedback-submission', element: <FeedbackSubmission /> }
  ]
};

export default MainRoutes;


