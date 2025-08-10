import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Description as DocumentIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  PriorityHigh as PriorityIcon,
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

// Mock data for application details
const mockApplicationDetail = {
  id: 1,
  applicantName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1-555-0123',
  applicationType: 'Business License',
  submissionDate: '2024-01-15',
  status: 'Pending',
  priority: 'High',
  documents: [
    { id: 1, name: 'ID Card', type: 'image/jpeg', size: '2.1 MB', uploadedAt: '2024-01-15' },
    { id: 2, name: 'Business Plan', type: 'application/pdf', size: '1.8 MB', uploadedAt: '2024-01-15' },
    { id: 3, name: 'Financial Statement', type: 'application/pdf', size: '3.2 MB', uploadedAt: '2024-01-15' }
  ],
  description: 'Application for new business license in downtown area. The business will be a coffee shop with seating capacity of 50 people. We plan to open from 7 AM to 10 PM daily.',
  businessAddress: '123 Main Street, Downtown, City, State 12345',
  businessType: 'Food & Beverage',
  expectedStartDate: '2024-03-01',
  feedback: [
    {
      id: 1,
      type: 'Request for Information',
      message: 'Please provide additional financial documentation including bank statements for the last 6 months.',
      adminName: 'Admin User',
      timestamp: '2024-01-16 10:30 AM',
      status: 'Pending Response'
    },
    {
      id: 2,
      type: 'Document Review',
      message: 'Your business plan has been reviewed. Please ensure all required sections are completed.',
      adminName: 'Admin User',
      timestamp: '2024-01-15 2:15 PM',
      status: 'Completed'
    }
  ]
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'success';
    case 'Rejected':
      return 'error';
    case 'In Review':
      return 'info';
    case 'Pending':
      return 'warning';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'success';
    default:
      return 'default';
  }
};

const getFeedbackTypeColor = (type) => {
  switch (type) {
    case 'Request for Information':
      return 'warning';
    case 'Document Review':
      return 'info';
    case 'Approval':
      return 'success';
    case 'Rejection':
      return 'error';
    default:
      return 'default';
  }
};

const ApplicationDetail = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(mockApplicationDetail);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    // In real app, fetch application details by ID
    // setApplication(fetchedApplication);
  }, [applicationId]);

  const handleBack = () => {
    navigate('/admin/applications');
  };

  const handleProcessApplication = () => {
    navigate(`/admin/applications/${applicationId}/process`);
  };

  const handleSendFeedback = () => {
    if (feedbackType && feedbackMessage.trim()) {
      const newFeedback = {
        id: Date.now(),
        type: feedbackType,
        message: feedbackMessage.trim(),
        adminName: 'Admin User',
        timestamp: new Date().toLocaleString(),
        status: 'Pending Response'
      };

      setApplication(prev => ({
        ...prev,
        feedback: [newFeedback, ...prev.feedback]
      }));

      setFeedbackType('');
      setFeedbackMessage('');
      setShowFeedbackDialog(false);
      setShowSuccessAlert(true);

      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  const handleDownloadDocument = (document) => {
    // In real app, this would trigger file download
    console.log('Downloading:', document.name);
  };

  const handleViewDocument = (document) => {
    // In real app, this would open document viewer
    console.log('Viewing:', document.name);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Success Alert */}
      {showSuccessAlert && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Feedback sent successfully!
        </Alert>
      )}

      {/* Header with Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={handleBack}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <BackIcon sx={{ mr: 0.5, fontSize: 16 }} />
            Applications
          </Link>
          <Typography color="text.primary">Application #{application.id}</Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Application Details
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleProcessApplication}
          >
            Process Application
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Application Information */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Application Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Applicant Name
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {application.applicantName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {application.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {application.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Submission Date
                      </Typography>
                      <Typography variant="body1">
                        {application.submissionDate}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Business Type
                      </Typography>
                      <Typography variant="body1">
                        {application.businessType}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Expected Start Date
                      </Typography>
                      <Typography variant="body1">
                        {application.expectedStartDate}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Business Address
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {application.businessAddress}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1">
                {application.description}
              </Typography>
            </CardContent>
          </Card>

          {/* Documents Section */}
          <Card elevation={0} variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Submitted Documents
              </Typography>
              
              <List>
                {application.documents.map((doc, index) => (
                  <React.Fragment key={doc.id}>
                    <ListItem>
                      <ListItemIcon>
                        <DocumentIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={doc.name}
                        secondary={`${doc.size} • Uploaded on ${doc.uploadedAt}`}
                      />
                      <Box>
                        <Tooltip title="View Document">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Document">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItem>
                    {index < application.documents.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Status and Actions Sidebar */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status & Priority
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current Status
                </Typography>
                <Chip 
                  label={application.status} 
                  color={getStatusColor(application.status)} 
                  variant="outlined" 
                  sx={{ mb: 1 }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Priority Level
                </Typography>
                <Chip 
                  label={application.priority} 
                  color={getPriorityColor(application.priority)} 
                  variant="outlined" 
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SendIcon />}
                onClick={() => setShowFeedbackDialog(true)}
                sx={{ mb: 2 }}
              >
                Send Feedback
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleProcessApplication}
              >
                Process Application
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Feedback History */}
      <Card elevation={0} variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Feedback History
          </Typography>
          
          {application.feedback.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
              No feedback yet
            </Typography>
          ) : (
            <List>
              {application.feedback.map((feedback, index) => (
                <React.Fragment key={feedback.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        A
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {feedback.adminName}
                          </Typography>
                          <Chip 
                            label={feedback.type} 
                            color={getFeedbackTypeColor(feedback.type)} 
                            size="small" 
                            variant="outlined" 
                          />
                          <Chip 
                            label={feedback.status} 
                            color={feedback.status === 'Completed' ? 'success' : 'warning'} 
                            size="small" 
                            variant="outlined" 
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {feedback.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {feedback.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < application.feedback.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <Dialog 
        open={showFeedbackDialog} 
        onClose={() => setShowFeedbackDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Feedback to Applicant</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Feedback Type</InputLabel>
            <Select
              value={feedbackType}
              label="Feedback Type"
              onChange={(e) => setFeedbackType(e.target.value)}
            >
              <MenuItem value="Request for Information">Request for Information</MenuItem>
              <MenuItem value="Document Review">Document Review</MenuItem>
              <MenuItem value="Approval">Approval</MenuItem>
              <MenuItem value="Rejection">Rejection</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Feedback Message"
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            placeholder="Enter your feedback or request for the applicant..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFeedbackDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendFeedback}
            variant="contained"
            disabled={!feedbackType || !feedbackMessage.trim()}
          >
            Send Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationDetail;
