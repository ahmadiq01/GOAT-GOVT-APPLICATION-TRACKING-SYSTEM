import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  TablePagination,
  IconButton,
  Alert
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Pending as PendingIcon,
  CheckCircle as CompletedIcon,
  Feedback as FeedbackIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Card as AntCard } from 'antd';
import { Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';

// API service functions
const API_BASE_URL = 'https://goat-govt-application-tracking-system-backend-production.up.railway.app';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const fetchApplications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/comprehensive`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

// Status mapping functions
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'approved':
      return 'success';
    case 'submitted':
    case 'pending':
      return 'warning';
    case 'under review':
    case 'in progress':
      return 'info';
    case 'feedback required':
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  return status || 'Unknown Status';
};

const ApplicationsTable = ({ applications, loading, onFeedbackClick, onViewDetails, onRefresh }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownloadAttachment = (attachment, applicationSubject) => {
    console.log(`Downloading attachment for: ${applicationSubject}`);
    const link = document.createElement('a');
    link.href = attachment.fileUrl;
    link.download = attachment.originalName || `${applicationSubject.replace(/\s+/g, '_')}.pdf`;
    link.target = '_blank';
    link.click();
  };

  const displayApplications = applications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight="medium" align="left">
          My Applications ({applications.length} total)
        </Typography>
        <Button 
          startIcon={<RefreshIcon />} 
          size="small"
          onClick={onRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell align="left">Tracking Number</TableCell>
              <TableCell align="left">Application Subject</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Assigned Officer</TableCell>
              <TableCell align="left">Submitted Date</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">Remarks</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : displayApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No applications found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayApplications.map((application) => (
                <TableRow key={application._id} hover>
                  <TableCell align="left">
                    <Typography variant="body2" fontWeight="medium" color="primary">
                      {application.trackingNumber}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="body2" fontWeight="medium">
                      {application.applicationType?.name || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Chip
                      label={getStatusLabel(application.status)}
                      color={getStatusColor(application.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {application.officer?.name || 'Not Assigned'}
                      </Typography>
                      {application.officer?.designation && (
                        <Typography variant="caption" color="text.secondary">
                          {application.officer.designation}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="body2">
                      {new Date(application.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                      title={application.description}
                    >
                      {application.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Button
                        startIcon={<VisibilityIcon />}
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => onViewDetails(application)}
                      >
                        View Details
                      </Button>
                      
                      {application.status?.toLowerCase() === 'feedback required' && (
                        <Button
                          startIcon={<FeedbackIcon />}
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => onFeedbackClick(application)}
                        >
                          Submit Feedback
                        </Button>
                      )}
                      
                      {application.attachments && application.attachments.length > 0 && (
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleDownloadAttachment(
                            application.attachments[0], 
                            application.applicationType?.name
                          )}
                          title="Download Attachment"
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={applications.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        showFirstButton
        showLastButton
      />
    </Paper>
  );
};

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    totalApplications: 0,
    submittedApplications: 0,
    completedApplications: 0,
    feedbackRequired: 0,
    underReview: 0
  });
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      const userDataStr = localStorage.getItem('userData');
      
      if (!token) {
        navigate('/login');
        return;
      }

      if (userDataStr) {
        setUserData(JSON.parse(userDataStr));
      }

      const response = await fetchApplications();
      
      if (response.success) {
        const { applications: appData, statistics: stats } = response.data;
        
        setApplications(appData);
        
        // Calculate statistics from the API response
        const total = appData.length;
        const submitted = appData.filter(app => app.status?.toLowerCase() === 'submitted').length;
        const completed = appData.filter(app => 
          app.status?.toLowerCase() === 'completed' || 
          app.status?.toLowerCase() === 'approved'
        ).length;
        const feedback = appData.filter(app => 
          app.status?.toLowerCase() === 'feedback required' ||
          app.status?.toLowerCase() === 'feedback_required'
        ).length;
        const review = appData.filter(app => 
          app.status?.toLowerCase() === 'under review' ||
          app.status?.toLowerCase() === 'in progress'
        ).length;
        
        setStatistics({
          totalApplications: total,
          submittedApplications: submitted,
          completedApplications: completed,
          feedbackRequired: feedback,
          underReview: review
        });
      } else {
        throw new Error(response.message || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setError(error.message);
      
      // If unauthorized, redirect to login
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [navigate]);

  const handleFeedbackClick = (application) => {
    // Navigate to feedback page with application data
    navigate('/app/feedback', { state: { application } });
  };

  const handleViewDetails = (application) => {
    // Navigate to application details page with application data
    navigate('/app/ApplicationDetails', { state: { application } });
  };

  const handleRefresh = () => {
    loadApplications();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Box sx={{ py: 3, px: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="textPrimary" align="left">
              My Dashboard
            </Typography>
            {userData && (
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" fontWeight="medium">
                  Welcome, {userData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData.email}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Content */}
      <Box sx={{ px: 4, pb: 4 }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          <AntCard style={{ flex: 1, minWidth: '200px' }}>
            <Statistic 
              title="Total Applications" 
              value={statistics.totalApplications} 
              valueStyle={{ color: '#1890ff' }}
              prefix={<AssignmentIcon />}
              loading={loading}
            />
          </AntCard>
          <AntCard style={{ flex: 1, minWidth: '200px' }}>
            <Statistic 
              title="Submitted" 
              value={statistics.submittedApplications} 
              valueStyle={{ color: '#faad14' }}
              prefix={<PendingIcon />}
              loading={loading}
            />
          </AntCard>
          <AntCard style={{ flex: 1, minWidth: '200px' }}>
            <Statistic 
              title="Completed" 
              value={statistics.completedApplications} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CompletedIcon />}
              loading={loading}
            />
          </AntCard>
          <AntCard style={{ flex: 1, minWidth: '200px' }}>
            <Statistic 
              title="Feedback Required" 
              value={statistics.feedbackRequired} 
              valueStyle={{ color: '#f5222d' }}
              prefix={<FeedbackIcon />}
              loading={loading}
            />
          </AntCard>
          <AntCard style={{ flex: 1, minWidth: '200px' }}>
            <Statistic 
              title="Under Review" 
              value={statistics.underReview} 
              valueStyle={{ color: '#722ed1' }}
              loading={loading}
            />
          </AntCard>
        </Box>

        {/* Applications Table */}
        <ApplicationsTable
          applications={applications}
          loading={loading}
          onFeedbackClick={handleFeedbackClick}
          onViewDetails={handleViewDetails}
          onRefresh={handleRefresh}
        />
      </Box>
    </Box>
  );
};

export default UserDashboard;