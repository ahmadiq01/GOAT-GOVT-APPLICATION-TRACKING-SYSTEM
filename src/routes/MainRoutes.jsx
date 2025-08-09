import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import ErrorBoundary from './ErrorBoundary';

// pages (lazy-loaded)
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const ViewPackages = Loadable(lazy(() => import('views/dashboard/Default/SuperAdmin/ViewPackages')));
const FeedbackSubmission = Loadable(lazy(() => import('views/dashboard/Default/User/FeedbackeSubmisson')));

// ==============================|| MAIN ROUTING ||============================== //
const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  errorElement: <ErrorBoundary />,
  children: [
    // Default redirect to dashboard when under main layout
    { index: true, element: <Navigate to="/dashboard" replace /> },

    // Dashboard
    { path: '/dashboard', element: <DashboardDefault /> },

    // Example additional routes used in the app
    { path: '/ViewPackages', element: <ViewPackages /> },
    { path: '/feedback', element: <FeedbackSubmission /> }
  ]
};

export default MainRoutes;


