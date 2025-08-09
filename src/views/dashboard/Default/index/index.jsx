import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import AdminDashboard from '../Admin/admn';
import SuperAdminDashboard from '../SuperAdmin/superadmin';
import UserDashboard from '../User/user';

// Function to get user role from localStorage
const getUserRole = () => {
  try {
    const userRole = localStorage.getItem('userRole');
    return userRole ? userRole.toLowerCase() : null;
  } catch (error) {
    console.error('Error reading user role:', error);
    return null;
  }
};

const Dashboard = () => {
  const userRole = getUserRole();
  const isAdmin = userRole === 'admin';
  const isSuperAdmin = userRole === 'superadmin';
  const isUser = userRole === 'user';

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {isAdmin && <AdminDashboard />}
      {isSuperAdmin && <SuperAdminDashboard />}
      {isUser && <UserDashboard />}
      {!isAdmin && !isSuperAdmin && !isUser && (
        <Alert severity="warning">
          Unable to determine user role. Please contact support.
        </Alert>
      )}
    </Box>
  );
};

export default Dashboard;
