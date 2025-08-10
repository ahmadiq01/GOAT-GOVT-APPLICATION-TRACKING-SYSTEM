import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Tabs, Tab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ApplicationsList from './ViewApplicationsList';
import NotificationCenter from './ViewNotificationCenter';
import UserManagement from './ViewUserManagement';
import axios from 'axios'; // Import axios for API calls

export default function ApplicationManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [formData, setFormData] = useState({
    applicantName: '',
    description: '',
    officerAssigned: '',
    status: 'Submitted',
    remarks: '',
    attachedDocuments: [],
    submittedDate: new Date().toISOString().split('T')[0],
    applicationType: '',
    priority: 'Normal',
    contactEmail: '',
    contactPhone: ''
  });
  const [applications, setApplications] = useState([]); // Store the fetched applications
  const [loading, setLoading] = useState(false); // To track the loading state

  // Function to fetch the applications from the API
  const fetchApplications = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get('https://esim.codistan.org/api/applications/all');
      setApplications(response.data.data); // Assuming the API response has a 'data' field
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchApplications(); // Fetch applications when component mounts
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNewApplication = () => {
    setSelectedApplication(null);
    setFormData({
      applicantName: '',
      description: '',
      officerAssigned: '',
      status: 'Submitted',
      remarks: '',
      attachedDocuments: [],
      submittedDate: new Date().toISOString().split('T')[0],
      applicationType: '',
      priority: 'Normal',
      contactEmail: '',
      contactPhone: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (application) => {
    setSelectedApplication(application);
    setFormData({
      applicantName: application.applicantName || '',
      description: application.description || '',
      officerAssigned: application.officerAssigned || '',
      status: application.status || 'Submitted',
      remarks: application.remarks || '',
      attachedDocuments: application.attachedDocuments || [],
      submittedDate: application.submittedDate || new Date().toISOString().split('T')[0],
      applicationType: application.applicationType || '',
      priority: application.priority || 'Normal',
      contactEmail: application.contactEmail || '',
      contactPhone: application.contactPhone || ''
    });
    setIsModalOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Box sx={{ py: 3, px: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="textPrimary" align="left">
              Application Management
            </Typography>
            {activeTab === 0 && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleNewApplication}
              >
                Add Application
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      {/* Content */}
      <Box sx={{ px: 4, pb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="application management tabs" sx={{ '& .MuiTab-root': { textAlign: 'left' } }}>
            <Tab label="Applications" />
            <Tab label="Notifications" />
            <Tab label="User Management" />
          </Tabs>
        </Box>
        
        {activeTab === 0 ? (
          <ApplicationsList 
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            selectedApplication={selectedApplication}
            formData={formData}
            setFormData={setFormData}
            handleEdit={handleEdit}
            applications={applications} // Pass the fetched applications
            loading={loading} // Pass the loading state
          />
        ) : activeTab === 1 ? (
          <NotificationCenter />
        ) : (
          <UserManagement />
        )}
      </Box>
    </Box>
  );
}