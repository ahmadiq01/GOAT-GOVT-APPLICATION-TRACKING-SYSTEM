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
  ListItemSecondaryAction,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const FeedbackSubmission = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const application = location.state?.application;

  const [formData, setFormData] = useState({
    comments: '',
    explanation: ''
  });
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Redirect if no application data
  useEffect(() => {
    if (!application) {
      navigate('/app/dashboard');
    }
  }, [application, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: `File "${file.name}" is too large. Maximum size is 10MB.`,
          severity: 'error'
        });
        return;
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          message: `File type "${file.type}" is not allowed.`,
          severity: 'error'
        });
        return;
      }

      const fileWithId = {
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploaded: false
      };

      setAttachedFiles(prev => [...prev, fileWithId]);
    });

    // Clear the input
    event.target.value = '';
  };

  const handleRemoveFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateForm = () => {
    if (!formData.comments.trim() && !formData.explanation.trim()) {
      setSnackbar({
        open: true,
        message: 'Please provide either comments or explanation.',
        severity: 'error'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call for feedback submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real application, you would:
      // 1. Upload files to server
      // 2. Submit feedback data
      // 3. Update application status

      console.log('Submitting feedback:', {
        applicationId: application.id,
        comments: formData.comments,
        explanation: formData.explanation,
        files: attachedFiles.map(f => f.name)
      });

      setSnackbar({
        open: true,
        message: 'Feedback submitted successfully!',
        severity: 'success'
      });

      // Navigate back to dashboard after successful submission
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 2000);

    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to submit feedback. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!application) {
    return null;
  }

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
              Submit Feedback
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Content */}
      <Box sx={{ px: 4, pb: 4 }}>
        <Grid container spacing={3}>
          {/* Application Details Card */}
          <Grid item xs={12}>
            <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Application Details
                  </Typography>
                  <Chip
                    label="Feedback Required"
                    color="error"
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="textSecondary">
                      Application Subject
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {application.applicationSubject}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      Assigned Officer
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {application.officer}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      Date
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(application.date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Feedback Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle1" fontWeight="medium" align="left">
                  Provide Your Feedback
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Comments"
                        name="comments"
                        value={formData.comments}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        placeholder="Enter your comments here..."
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Additional Explanation"
                        name="explanation"
                        value={formData.explanation}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        placeholder="Provide any additional explanation or clarification..."
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography variant="subtitle2">
                          Attach Supporting Documents
                        </Typography>
                        <input
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                          style={{ display: 'none' }}
                          id="file-upload"
                          multiple
                          type="file"
                          onChange={handleFileUpload}
                        />
                        <label htmlFor="file-upload">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<AttachFileIcon />}
                            size="small"
                          >
                            Choose Files
                          </Button>
                        </label>
                      </Box>

                      {attachedFiles.length > 0 && (
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Attached Files ({attachedFiles.length})
                          </Typography>
                          <List dense>
                            {attachedFiles.map((file, index) => (
                              <React.Fragment key={file.id}>
                                <ListItem>
                                  <DescriptionIcon sx={{ mr: 2, color: 'text.secondary' }} />
                                  <ListItemText
                                    primary={file.name}
                                    secondary={`${formatFileSize(file.size)} • ${file.type}`}
                                  />
                                  <ListItemSecondaryAction>
                                    <IconButton
                                      edge="end"
                                      aria-label="delete"
                                      onClick={() => handleRemoveFile(file.id)}
                                      size="small"
                                      color="error"
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                </ListItem>
                                {index < attachedFiles.length - 1 && <Divider />}
                              </React.Fragment>
                            ))}
                          </List>
                        </Paper>
                      )}

                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                        Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT (Max size: 10MB per file)
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          onClick={() => navigate('/app/dashboard')}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
                          disabled={loading}
                        >
                          {loading ? 'Submitting...' : 'Submit Feedback'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Guidelines Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Submission Guidelines
                </Typography>
                <List dense>
                  <ListItem>
                    <CheckCircleIcon sx={{ mr: 1, color: 'success.main', fontSize: 16 }} />
                    <ListItemText
                      primary="Be Clear and Specific"
                      secondary="Provide detailed information about your response"
                    />
                  </ListItem>
                  <ListItem>
                    <CheckCircleIcon sx={{ mr: 1, color: 'success.main', fontSize: 16 }} />
                    <ListItemText
                      primary="Include Supporting Documents"
                      secondary="Attach any relevant files that support your feedback"
                    />
                  </ListItem>
                  <ListItem>
                    <CheckCircleIcon sx={{ mr: 1, color: 'success.main', fontSize: 16 }} />
                    <ListItemText
                      primary="Review Before Submitting"
                      secondary="Double-check your information before final submission"
                    />
                  </ListItem>
                  <ListItem>
                    <CheckCircleIcon sx={{ mr: 1, color: 'success.main', fontSize: 16 }} />
                    <ListItemText
                      primary="Professional Language"
                      secondary="Use formal and respectful language in your responses"
                    />
                  </ListItem>
                </List>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  Your feedback will be reviewed by the assigned officer. You may receive follow-up questions if additional clarification is needed.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

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

export default FeedbackSubmission;