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
  Download as DownloadIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Mock user data
const mockUserData = {
  name: 'Ahmed Khan',
  email: 'ahmed.khan@email.com',
  phone: '+92 300 1234567',
  address: '123 Main Street, Saddar, Rawalpindi, Punjab, Pakistan',
  cnic: '12345-6789012-3',
  avatar: null
};

// Mock documents data
const mockDocuments = [
  {
    id: 1,
    name: 'Business_License_Form.pdf',
    type: 'application/pdf',
    url: 'data:application/pdf;base64,mock-pdf-data',
    size: '2.1 MB',
    uploadDate: '2024-08-05'
  },
  {
    id: 2,
    name: 'Identity_Document.jpg',
    type: 'image/jpeg',
    url: 'https://via.placeholder.com/600x800/e3f2fd/1976d2?text=CNIC+Front',
    size: '1.2 MB',
    uploadDate: '2024-08-05'
  },
  {
    id: 3,
    name: 'Business_Plan.pdf',
    type: 'application/pdf',
    url: 'data:application/pdf;base64,mock-pdf-data-2',
    size: '3.5 MB',
    uploadDate: '2024-08-05'
  }
];

// Mock comments/chat data
const mockComments = [
  {
    id: 1,
    sender: 'officer',
    senderName: 'John Smith',
    message: 'Thank you for submitting your business license application. I have reviewed the initial documents and need some clarification on the business structure details.',
    timestamp: '2024-08-06T10:30:00Z',
    avatar: null
  },
  {
    id: 2,
    sender: 'user',
    senderName: 'Ahmed Khan',
    message: 'Thank you for the quick response. Could you please specify which particular aspects of the business structure need clarification? I am ready to provide additional information.',
    timestamp: '2024-08-06T14:15:00Z',
    avatar: null
  },
  {
    id: 3,
    sender: 'officer',
    senderName: 'John Smith',
    message: 'I need clarification on the partnership structure and the roles of each partner. Please provide a detailed partnership agreement or document outlining responsibilities.',
    timestamp: '2024-08-07T09:20:00Z',
    avatar: null
  }
];

const ApplicationDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const application = location.state?.application;

  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);

  // Redirect if no application data - but allow direct access for demo purposes
  useEffect(() => {
    if (!application) {
      // For demo purposes, create a mock application if none provided
      console.log('No application data provided, using mock data for demonstration');
    }
  }, [application, navigate]);

  // Use mock application data if none provided (for demo purposes)
  const displayApplication = application || {
    id: 'demo-001',
    applicationSubject: 'Business License Application',
    status: 'pending',
    officer: 'Officer A. Johnson',
    date: '2024-01-15',
    remarks: 'Application is under review. Additional documentation may be required.'
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const comment = {
        id: comments.length + 1,
        sender: 'user',
        senderName: mockUserData.name,
        message: newComment.trim(),
        timestamp: new Date().toISOString(),
        avatar: null
      };

      setComments(prev => [...prev, comment]);
      setNewComment('');
      
      setSnackbar({
        open: true,
        message: 'Comment submitted successfully!',
        severity: 'success'
      });

    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to submit comment. Please try again.',
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
    // In a real application, this would download the actual file
    console.log(`Downloading: ${document.name}`);
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
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

  // Component will always render now with either real or mock data

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
                  User Details
                </Typography>
              </Box>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {mockUserData.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      CNIC: {mockUserData.cnic}
                    </Typography>
                  </Box>
                </Box>
                
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <ListItemText
                      primary="Email"
                      secondary={mockUserData.email}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <ListItemText
                      primary="Phone"
                      secondary={mockUserData.phone}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <HomeIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <ListItemText
                      primary="Address"
                      secondary={mockUserData.address}
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
                    label={displayApplication.status.replace('_', ' ').toUpperCase()}
                    color={displayApplication.status === 'completed' ? 'success' : 
                           displayApplication.status === 'feedback_required' ? 'error' : 
                           displayApplication.status === 'pending' ? 'warning' : 'info'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Application Subject
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {displayApplication.applicationSubject}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Application ID
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      APP-{String(displayApplication.id).padStart(6, '0')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Assigned Officer
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {displayApplication.officer}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Submission Date
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(displayApplication.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Current Remarks
                    </Typography>
                    <Typography variant="body1">
                      {displayApplication.remarks || 'No remarks available'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Documents Card */}
            <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Attached Documents ({mockDocuments.length})
                </Typography>
              </Box>
              <CardContent>
                <Grid container spacing={2}>
                  {mockDocuments.map((document) => (
                    <Grid item xs={12} sm={6} md={4} key={document.id}>
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
                          {document.type.includes('image') ? (
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
                            {document.name}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
                          {document.size} • {new Date(document.uploadDate).toLocaleDateString()}
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
            {selectedDocument?.type.includes('image') ? <ImageIcon /> : <PdfIcon />}
            {selectedDocument?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Box sx={{ textAlign: 'center' }}>
              {selectedDocument.type.includes('image') ? (
                <img
                  src={selectedDocument.url}
                  alt={selectedDocument.name}
                  style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                />
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <PdfIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    PDF Document
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {selectedDocument.name} ({selectedDocument.size})
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