import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  Snackbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// API service functions
const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const fetchApplicationDetails = async (applicationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching application details:', error);
    throw error;
  }
};

const submitComment = async (applicationId, commentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(commentData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting comment:', error);
    throw error;
  }
};

// Mock comments data - you can replace this with real API data when available
const mockComments = [
  {
    id: 1,
    sender: 'officer',
    senderName: 'System Officer',
    message: 'Application received and is under initial review. All required documents have been verified.',
    timestamp: new Date().toISOString(),
    avatar: null
  }
];

const ApplicationDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const application = location.state?.application;

  const [applicationDetails, setApplicationDetails] = useState(application);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);

  // Get user data from localStorage
  const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;

  useEffect(() => {
    if (application && application._id) {
      loadApplicationDetails(application._id);
    } else if (!application) {
      console.log('No application data provided');
      // For demo purposes, allow viewing without redirecting
    }
  }, [application]);

  const loadApplicationDetails = async (applicationId) => {
    setDetailsLoading(true);
    try {
      const response = await fetchApplicationDetails(applicationId);
      if (response.success) {
        setApplicationDetails(response.data);
      }
    } catch (error) {
      console.error('Error loading application details:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load application details.',
        severity: 'error'
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  // Use real or mock application data
  const displayApplication = applicationDetails || {
    _id: 'demo-001',
    trackingNumber: 'DEMO-123456789-0001',
    applicationType: { name: 'Demo Application' },
    status: 'Submitted',
    officer: { name: 'Demo Officer', designation: 'Demo Designation' },
    submittedAt: new Date().toISOString(),
    description: 'This is a demo application for testing purposes.',
    user: userData || {
      name: 'Demo User',
      email: 'demo@example.com',
      phoneNo: '+92-300-0000000',
      address: 'Demo Address',
      nic: '00000-0000000-0'
    },
    attachments: []
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    
    if (!newComment.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a comment.',
        severity: 'error'
      });
      return;
    }

    setLoading(true);

    try {
      // If we have a real application ID, try to submit to API
      if (displayApplication._id && displayApplication._id !== 'demo-001') {
        const commentData = {
          message: newComment.trim()
        };

        const response = await submitComment(displayApplication._id, commentData);
        
        if (response.success) {
          // Add the comment from API response or create locally
          const comment = response.data || {
            id: comments.length + 1,
            sender: 'user',
            senderName: userData?.name || 'You',
            message: newComment.trim(),
            timestamp: new Date().toISOString(),
            avatar: null
          };
          
          setComments(prev => [...prev, comment]);
        }
      } else {
        // For demo purposes, add comment locally
        const comment = {
          id: comments.length + 1,
          sender: 'user',
          senderName: userData?.name || 'Demo User',
          message: newComment.trim(),
          timestamp: new Date().toISOString(),
          avatar: null
        };

        setComments(prev => [...prev, comment]);
      }

      setNewComment('');
      
      setSnackbar({
        open: true,
        message: 'Comment submitted successfully!',
        severity: 'success'
      });

    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to submit comment. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setDocumentDialogOpen(true);
  };

  const handleDownloadDocument = (document) => {
    console.log(`Downloading: ${document.originalName || document.name}`);
    const link = document.createElement('a');
    link.href = document.fileUrl || document.url;
    link.download = document.originalName || document.name;
    link.target = '_blank';
    link.click();
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Box sx={{ py: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/app/dashboard')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" fontWeight="bold" color="textPrimary">
              Application Details
            </Typography>
            {detailsLoading && <CircularProgress size={24} />}
          </Box>
        </Box>
      </Paper>

      {/* Content */}
      <Box sx={{ px: 4, pb: 4 }}>
        <Grid container spacing={3}>
          
          {/* User Details Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Applicant Details
                </Typography>
              </Box>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {displayApplication.user?.name || displayApplication.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      CNIC: {displayApplication.user?.nic || displayApplication.cnic}
                    </Typography>
                  </Box>
                </Box>
                
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <ListItemText
                      primary="Email"
                      secondary={displayApplication.user?.email || displayApplication.email}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <ListItemText
                      primary="Phone"
                      secondary={displayApplication.user?.phoneNo || displayApplication.phone}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <HomeIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <ListItemText
                      primary="Address"
                      secondary={displayApplication.user?.address || displayApplication.address}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <BadgeIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <ListItemText
                      primary="Tracking Number"
                      secondary={displayApplication.trackingNumber}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            {/* Application Details Card */}
            <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Application Information
                  </Typography>
                  <Chip
                    label={displayApplication.status?.toUpperCase() || 'UNKNOWN'}
                    color={getStatusColor(displayApplication.status)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Application Type
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {displayApplication.applicationType?.name || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Application ID
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {displayApplication._id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Assigned Officer
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {displayApplication.officer?.name || 'Not Assigned'}
                    </Typography>
                    {displayApplication.officer?.designation && (
                      <Typography variant="caption" color="textSecondary" display="block">
                        {displayApplication.officer.designation}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Submission Date
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(displayApplication.submittedAt || displayApplication.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Acknowledgement
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {displayApplication.acknowledgement || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {displayApplication.description || 'No description available'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Documents Card */}
            {displayApplication.attachments && displayApplication.attachments.length > 0 && (
              <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Attached Documents ({displayApplication.attachments.length})
                  </Typography>
                </Box>
                <CardContent>
                  <Grid container spacing={2}>
                    {displayApplication.attachments.map((document, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            '&:hover': { boxShadow: 2 },
                            transition: 'box-shadow 0.2s'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {document.fileUrl?.includes('image') || document.originalName?.includes('.jpg') || document.originalName?.includes('.png') ? (
                              <ImageIcon sx={{ mr: 1, color: 'success.main' }} />
                            ) : (
                              <PdfIcon sx={{ mr: 1, color: 'error.main' }} />
                            )}
                            <Typography 
                              variant="body2" 
                              fontWeight="medium" 
                              sx={{ 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis', 
                                whiteSpace: 'nowrap',
                                flex: 1
                              }}
                            >
                              {document.originalName || `Document ${index + 1}`}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
                            {new Date(displayApplication.submittedAt).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewDocument(document)}
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={() => handleDownloadDocument(document)}
                            >
                              Download
                            </Button>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Comments/Chat Section */}
          <Grid item xs={12}>
            <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Communication Thread
                </Typography>
              </Box>
              <CardContent sx={{ maxHeight: 500, overflow: 'auto' }}>
                {comments.length === 0 ? (
                  <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 4 }}>
                    No comments yet. Start the conversation below.
                  </Typography>
                ) : (
                  <List>
                    {comments.map((comment, index) => (
                      <React.Fragment key={comment.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                          <Avatar sx={{ 
                            mr: 2, 
                            mt: 0.5,
                            bgcolor: comment.sender === 'officer' ? 'primary.main' : 'secondary.main' 
                          }}>
                            {comment.senderName.charAt(0)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {comment.senderName}
                              </Typography>
                              <Chip 
                                label={comment.sender === 'officer' ? 'Officer' : 'User'} 
                                size="small" 
                                variant="outlined"
                                color={comment.sender === 'officer' ? 'primary' : 'secondary'}
                              />
                              <Typography variant="caption" color="textSecondary">
                                {formatTimestamp(comment.timestamp)}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {comment.message}
                            </Typography>
                          </Box>
                        </ListItem>
                        {index < comments.length - 1 && <Divider sx={{ my: 2 }} />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
              
              {/* Comment Input */}
              <Box sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
                <Box component="form" onSubmit={handleSubmitComment}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Type your message here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
                      disabled={loading || !newComment.trim()}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Document Viewer Dialog */}
      <Dialog
        open={documentDialogOpen}
        onClose={() => setDocumentDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {selectedDocument?.fileUrl?.includes('image') || selectedDocument?.originalName?.includes('.jpg') || selectedDocument?.originalName?.includes('.png') ? <ImageIcon /> : <PdfIcon />}
            {selectedDocument?.originalName || 'Document'}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Box sx={{ textAlign: 'center' }}>
              {selectedDocument.fileUrl?.includes('image') || selectedDocument.originalName?.includes('.jpg') || selectedDocument.originalName?.includes('.png') ? (
                <img
                  src={selectedDocument.fileUrl || selectedDocument.url}
                  alt={selectedDocument.originalName}
                  style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                />
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <PdfIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    PDF Document
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {selectedDocument.originalName}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadDocument(selectedDocument)}
                  >
                    Download to View
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocumentDialogOpen(false)}>Close</Button>
          {selectedDocument && (
            <Button
              startIcon={<DownloadIcon />}
              onClick={() => handleDownloadDocument(selectedDocument)}
            >
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApplicationDetails;