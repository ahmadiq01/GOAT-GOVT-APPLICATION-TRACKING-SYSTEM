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
  IconButton
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

// Mock data for applications
const mockApplications = [
  {
    id: 1,
    applicationSubject: 'Business License Application',
    status: 'pending',
    officer: 'John Smith',
    date: '2024-08-05',
    requiresFeedback: false,
    pdfUrl: '/documents/app_001.pdf',
    remarks: 'Application submitted successfully. Awaiting initial review.'
  },
  {
    id: 2,
    applicationSubject: 'Tax Registration Request',
    status: 'feedback_required',
    officer: 'Sarah Johnson',
    date: '2024-08-03',
    requiresFeedback: true,
    pdfUrl: '/documents/app_002.pdf',
    remarks: 'Additional documentation required for tax compliance verification.'
  },
  {
    id: 3,
    applicationSubject: 'Construction Permit',
    status: 'completed',
    officer: 'Mike Wilson',
    date: '2024-07-28',
    requiresFeedback: false,
    pdfUrl: '/documents/app_003.pdf',
    remarks: 'Permit approved. Valid for 12 months from issue date.'
  },
  {
    id: 4,
    applicationSubject: 'Import License Application',
    status: 'under_review',
    officer: 'Lisa Chen',
    date: '2024-08-01',
    requiresFeedback: false,
    pdfUrl: '/documents/app_004.pdf',
    remarks: 'Currently under technical review by customs department.'
  },
  {
    id: 5,
    applicationSubject: 'Health Department Clearance',
    status: 'feedback_required',
    officer: 'David Brown',
    date: '2024-07-30',
    requiresFeedback: true,
    pdfUrl: '/documents/app_005.pdf',
    remarks: 'Health inspection report needs clarification on safety protocols.'
  },
  {
    id: 6,
    applicationSubject: 'Environmental Impact Assessment',
    status: 'completed',
    officer: 'Emma Davis',
    date: '2024-07-25',
    requiresFeedback: false,
    pdfUrl: '/documents/app_006.pdf',
    remarks: 'Assessment completed. No significant environmental impact found.'
  },
  {
    id: 7,
    applicationSubject: 'Fire Safety Certificate',
    status: 'pending',
    officer: 'Tom Wilson',
    date: '2024-08-07',
    requiresFeedback: false,
    pdfUrl: '/documents/app_007.pdf',
    remarks: 'Scheduled for fire safety inspection next week.'
  },
  {
    id: 8,
    applicationSubject: 'Zoning Variance Request',
    status: 'under_review',
    officer: 'Alex Rodriguez',
    date: '2024-08-02',
    requiresFeedback: false,
    pdfUrl: '/documents/app_008.pdf',
    remarks: 'Planning committee reviewing variance request for compliance.'
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'under_review':
      return 'info';
    case 'feedback_required':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'pending':
      return 'Pending';
    case 'under_review':
      return 'Under Review';
    case 'feedback_required':
      return 'Feedback Required';
    default:
      return status;
  }
};

const ApplicationsTable = ({ applications, loading, onFeedbackClick, onViewDetails }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownloadPDF = (pdfUrl, applicationSubject) => {
    // In a real application, this would download the actual PDF
    console.log(`Downloading PDF for: ${applicationSubject}`);
    // You can implement actual download logic here
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${applicationSubject.replace(/\s+/g, '_')}.pdf`;
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
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell align="left">Application Subject</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Assigned Officer</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Remarks</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : displayApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No applications found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayApplications.map((application) => (
                <TableRow key={application.id} hover>
                  <TableCell align="left">
                    <Typography variant="body2" fontWeight="medium">
                      {application.applicationSubject}
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
                    <Typography variant="body2">
                      {application.officer}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="body2">
                      {new Date(application.date).toLocaleDateString('en-US', {
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
                      title={application.remarks}
                    >
                      {application.remarks || 'No remarks'}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Button
                        startIcon={<VisibilityIcon />}
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => onViewDetails(application)}
                      >
                        View Details
                      </Button>
                      
                      {application.requiresFeedback && (
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
                      
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleDownloadPDF(application.pdfUrl, application.applicationSubject)}
                        title="Download PDF"
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
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
  const [statistics, setStatistics] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    completedApplications: 0,
    feedbackRequired: 0,
    underReview: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplications(mockApplications);
      
      // Calculate statistics
      const total = mockApplications.length;
      const pending = mockApplications.filter(app => app.status === 'pending').length;
      const completed = mockApplications.filter(app => app.status === 'completed').length;
      const feedback = mockApplications.filter(app => app.status === 'feedback_required').length;
      const review = mockApplications.filter(app => app.status === 'under_review').length;
      
      setStatistics({
        totalApplications: total,
        pendingApplications: pending,
        completedApplications: completed,
        feedbackRequired: feedback,
        underReview: review
      });
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleFeedbackClick = (application) => {
    // Navigate to feedback page with application data
    navigate('/app/feedback', { state: { application } });
  };

  const handleViewDetails = (application) => {
    // Navigate to application details page with application data
    navigate('/app/ApplicationDetails', { state: { application } });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Box sx={{ py: 3, px: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="textPrimary" align="left">
            My Dashboard
          </Typography>
        </Box>
      </Paper>

      {/* Content */}
      <Box sx={{ px: 4, pb: 4 }}>
        {/* Statistics Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <AntCard style={{ flex: 1 }}>
            <Statistic 
              title="Total Applications" 
              value={statistics.totalApplications} 
              valueStyle={{ color: '#1890ff' }}
              prefix={<AssignmentIcon />}
            />
          </AntCard>
          <AntCard style={{ flex: 1 }}>
            <Statistic 
              title="Pending" 
              value={statistics.pendingApplications} 
              valueStyle={{ color: '#faad14' }}
              prefix={<PendingIcon />}
            />
          </AntCard>
          <AntCard style={{ flex: 1 }}>
            <Statistic 
              title="Completed" 
              value={statistics.completedApplications} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CompletedIcon />}
            />
          </AntCard>
          <AntCard style={{ flex: 1 }}>
            <Statistic 
              title="Feedback Required" 
              value={statistics.feedbackRequired} 
              valueStyle={{ color: '#f5222d' }}
              prefix={<FeedbackIcon />}
            />
          </AntCard>
          <AntCard style={{ flex: 1 }}>
            <Statistic 
              title="Under Review" 
              value={statistics.underReview} 
              valueStyle={{ color: '#722ed1' }}
            />
          </AntCard>
        </Box>

        {/* Applications Table */}
        <ApplicationsTable
          applications={applications}
          loading={loading}
          onFeedbackClick={handleFeedbackClick}
          onViewDetails={handleViewDetails}
        />
      </Box>
    </Box>
  );
};

export default UserDashboard;