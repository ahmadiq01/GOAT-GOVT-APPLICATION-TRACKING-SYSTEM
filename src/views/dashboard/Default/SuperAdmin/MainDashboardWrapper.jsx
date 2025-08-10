import React, { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import SuperAdminApplicationDashboard from './superadmin';
import ApplicationManagement from './ApplicationManagement';

const MainDashboardWrapper = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'management'

  const handleManageApplications = () => {
    setCurrentView('management');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Box sx={{ py: 3, px: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="textPrimary" align="left">
              {currentView === 'dashboard' ? 'Super Admin Dashboard' : 'Application Management'}
            </Typography>
            {currentView === 'management' && (
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      {/* Content */}
      <Box sx={{ px: 4, pb: 4 }}>
        {currentView === 'dashboard' ? (
          <SuperAdminApplicationDashboard onManageApplications={handleManageApplications} />
        ) : (
          <ApplicationManagement />
        )}
      </Box>
    </Box>
  );
};

export default MainDashboardWrapper;