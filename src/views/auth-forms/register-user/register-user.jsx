import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Avatar,
  Chip,
  Alert,
  Container,
  styled,
  useTheme,
  Divider,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  LinearProgress
} from '@mui/material';
import {
  AccountBalance as GovIcon,
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  Description as DescriptionIcon,
  Warning as ComplaintIcon,
  PersonAdd as NewUserIcon,
  Person as ExistingUserIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { makeDirectRequest } from '../../../utils/axiosInstance';

// Styled components for government styling with green theme
const GovPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  border: `2px solid #00ce5a`,
  position: 'relative',
  backgroundColor: '#fafafa',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #00ce5a, #00a047)',
  }
}));

const GovTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(0.5),
    backgroundColor: '#ffffff',
    '& fieldset': {
      borderColor: '#bdbdbd',
    },
    '&:hover fieldset': {
      borderColor: '#00ce5a',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00ce5a',
      borderWidth: '2px',
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
  }
}));

const GovSelect = styled(Select)(({ theme }) => ({
  borderRadius: theme.spacing(0.5),
  backgroundColor: '#ffffff',
  '& fieldset': {
    borderColor: '#bdbdbd',
  },
  '&:hover fieldset': {
    borderColor: '#00ce5a',
  },
  '&.Mui-focused fieldset': {
    borderColor: '#00ce5a',
    borderWidth: '2px',
  }
}));

const UploadArea = styled(Box)(({ theme, uploading }) => ({
  border: `2px dashed #00ce5a`,
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: uploading ? 'not-allowed' : 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: uploading ? '#f5f5f5' : '#ffffff',
  opacity: uploading ? 0.7 : 1,
  '&:hover': {
    borderColor: uploading ? '#00ce5a' : '#00a047',
    backgroundColor: uploading ? '#f5f5f5' : '#e8f8f0',
  }
}));

const GovButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #00ce5a, #00a047)',
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: '0 4px 12px rgba(0, 206, 90, 0.3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #00a047, #008a3d)',
    boxShadow: '0 6px 16px rgba(0, 206, 90, 0.4)',
  }
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: '#013f1b',
  color: 'white',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  boxShadow: '0 4px 12px rgba(1, 63, 27, 0.3)',
}));

const GovToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    border: `2px solid #00ce5a`,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1.5, 3),
    fontWeight: 600,
    color: '#00ce5a',
    backgroundColor: '#ffffff',
    '&:hover': {
      backgroundColor: '#e8f8f0',
      borderColor: '#00a047',
    },
    '&.Mui-selected': {
      backgroundColor: '#00ce5a',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#00a047',
      }
    }
  }
}));

export default function ComplaintRegistrationForm() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);
  
  // New state for registration type
  const [registrationType, setRegistrationType] = useState('new');
  
  // New state for API data
  const [officers, setOfficers] = useState([]);
  const [applicationTypes, setApplicationTypes] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [selectedApplicationType, setSelectedApplicationType] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // New state for file upload
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // New state for confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // File validation constants
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];

  // Fetch officers and application types on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setApiError('');
      
      try {
        // Fetch officers
        const officersResponse = await makeDirectRequest('officers', 'GET');
        setOfficers(officersResponse.data?.data || []);
        
        // Fetch application types
        const applicationTypesResponse = await makeDirectRequest('application-types', 'GET');
        setApplicationTypes(applicationTypesResponse.data?.data || []);
        
        // If no data is available, show a warning
        if ((officersResponse.data?.data || []).length === 0) {
          setApiError('Warning: No officers available. Please contact support.');
        }
        if ((applicationTypesResponse.data?.data || []).length === 0) {
          setApiError('Warning: No application types available. Please contact support.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // Provide more specific error messages
        if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
          setApiError('Network error: Unable to connect to the server. Please check your internet connection.');
        } else if (error.response?.status === 404) {
          setApiError('API endpoints not found. Please contact system administrator.');
        } else if (error.response?.status === 500) {
          setApiError('Server error: Please try again later or contact support.');
        } else {
          setApiError('Failed to load form data. Please refresh the page or contact support.');
        }
        
        // Set empty arrays to prevent form from breaking
        setOfficers([]);
        setApplicationTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRegistrationTypeChange = (event, newRegistrationType) => {
    if (newRegistrationType !== null) {
      setRegistrationType(newRegistrationType);
      // Clear form fields when switching registration type
      if (newRegistrationType === 'existing') {
        setName('');
        setPhone('');
        setEmail('');
        setAddress('');
      }
    }
  };

  // File validation function
  const validateFile = (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large. Maximum size allowed is 5MB.`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return `File "${file.name}" has an unsupported format. Allowed formats: PDF, JPG, PNG, DOC, DOCX.`;
    }

    return null; // File is valid
  };

  // Upload files to S3
  const uploadFiles = async (files) => {
    const formData = new FormData();
    
    // Append all files to FormData
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('https://goat-govt-application-tracking-system-backend-production.up.railway.app/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data?.files) {
        return result.data.files.map(file => ({
          id: file.id,
          url: file.url,
          originalName: file.originalName,
          mimeType: file.mimeType,
          size: file.size,
          uploadDate: file.uploadDate
        }));
      } else {
        throw new Error('Upload response format is invalid');
      }
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length === 0) return;

    // Validate all files first
    const validationErrors = [];
    selectedFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(error);
      }
    });

    if (validationErrors.length > 0) {
      setUploadError(validationErrors.join(' '));
      return;
    }

    // Check total files limit (optional - you can adjust this)
    if (attachments.length + selectedFiles.length > 10) {
      setUploadError('Maximum 10 files allowed per application.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const uploadedFiles = await uploadFiles(selectedFiles);
      
      // Add uploaded files to attachments
      setAttachments(prev => [...prev, ...uploadedFiles]);
      
      // Show success message
      setSuccessMessage(`Successfully uploaded ${uploadedFiles.length} file(s).`);
      
    } catch (error) {
      setUploadError(`Failed to upload files: ${error.message}`);
    } finally {
      setUploading(false);
      // Clear the file input
      e.target.value = '';
    }
  };

  // Remove uploaded file
  const handleRemoveFile = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    // CNIC validation
    if (!cnic) {
      setApiError('CNIC is required');
      return false;
    }
    
    // CNIC format validation (00000-0000000-0)
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(cnic)) {
      setApiError('Please enter CNIC in correct format: 00000-0000000-0');
      return false;
    }
    
    if (registrationType === 'new') {
      if (!name || !phone || !address) {
        setApiError('Name, phone, and address are required for new registrations');
        return false;
      }
      
      // Phone validation
      const phoneRegex = /^(\+92|0)?[3]\d{9}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        setApiError('Please enter a valid Pakistani mobile number');
        return false;
      }
      
      // Email validation (optional but if provided, should be valid)
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setApiError('Please enter a valid email address');
        return false;
      }
    }
    
    if (!selectedApplicationType) {
      setApiError('Please select an application type');
      return false;
    }
    if (!selectedOfficer) {
      setApiError('Please select an officer');
      return false;
    }
    if (!description || description.trim().length < 10) {
      setApiError('Please provide a detailed description (at least 10 characters)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Show confirmation dialog instead of submitting immediately
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setConfirmDialogOpen(false);
    setSubmitting(true);
    setApiError('');
    setSuccessMessage('');

    try {
      // Prepare the data according to the API structure
      const applicationData = {
        name: registrationType === 'new' ? name : 'Existing User',
        cnic: cnic,
        phone: registrationType === 'new' ? phone : 'N/A',
        email: registrationType === 'new' ? email : 'N/A',
        address: registrationType === 'new' ? address : 'N/A',
        applicationType: selectedApplicationType,
        officer: selectedOfficer,
        description: description,
        attachments: attachments.map(file => file.url) // Send URLs of uploaded files
      };

      // Submit the application
      const response = await makeDirectRequest('applications', 'POST', applicationData);
      
      if (response.status === 201 || response.status === 200) {
        setSuccessMessage('Application submitted successfully! Your application ID is: ' + (response.data?.data?._id || 'N/A'));
        
        // Reset form
        setName('');
        setCnic('');
        setPhone('');
        setEmail('');
        setAddress('');
        setDescription('');
        setAttachments([]);
        setSelectedOfficer('');
        setSelectedApplicationType('');
        setRegistrationType('new');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.message) {
        setApiError(error.message);
      } else {
        setApiError('Failed to submit application. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  const handleCloseUploadError = () => {
    setUploadError('');
  };

  // Helper function to format CNIC as user types
  const formatCNIC = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as 00000-0000000-0
    if (digits.length <= 5) {
      return digits;
    } else if (digits.length <= 12) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else {
      return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
    }
  };

  // Helper function to format phone number
  const formatPhone = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // If starts with 0, remove it
    if (digits.startsWith('0')) {
      return digits.slice(1);
    }
    
    // If starts with 92, remove it
    if (digits.startsWith('92')) {
      return digits.slice(2);
    }
    
    return digits;
  };

  const handleCNICChange = (e) => {
    const formatted = formatCNIC(e.target.value);
    setCnic(formatted);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress size={60} sx={{ color: '#00ce5a' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      py: 4,
      px: 2
    }}>
      <Container maxWidth="lg">
        {/* Government Header */}
        <HeaderBox>
          <Avatar sx={{
            width: 80,
            height: 80,
            bgcolor: 'rgba(255,255,255,0.2)',
            mx: 'auto',
            mb: 2
          }}>
            <GovIcon sx={{ fontSize: 40, color: 'white' }} />
          </Avatar>
          
          <Typography variant="h4" component="h1" sx={{
            fontWeight: 700,
            mb: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            color: 'white'
          }}>
            Government of Pakistan
          </Typography>
          
          <Typography variant="h5" sx={{
            fontWeight: 500,
            mb: 2,
            opacity: 0.9,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            color: 'white'
          }}>
            Government Application Submission System
          </Typography>
          
          <Typography variant="body1" sx={{
            opacity: 0.8,
            maxWidth: 600,
            mx: 'auto',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            color: 'white'
          }}>
            Submit your government application online for prompt processing by relevant authorities
          </Typography>
        </HeaderBox>

        {/* API Error Alert */}
        {apiError && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 1 }} 
            onClose={() => setApiError('')}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => {
                  setApiError('');
                  // Retry fetching data
                  const fetchData = async () => {
                    setLoading(true);
                    try {
                      const officersResponse = await makeDirectRequest('officers', 'GET');
                      setOfficers(officersResponse.data?.data || []);
                      
                      const applicationTypesResponse = await makeDirectRequest('application-types', 'GET');
                      setApplicationTypes(applicationTypesResponse.data?.data || []);
                    } catch (error) {
                      console.error('Retry failed:', error);
                      setApiError('Retry failed. Please check your connection and try again.');
                    } finally {
                      setLoading(false);
                    }
                  };
                  fetchData();
                }}
              >
                Retry
              </Button>
            }
          >
            {apiError}
          </Alert>
        )}

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 1 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        {/* Form Card */}
        <GovPaper elevation={2}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{
              fontWeight: 600,
              color: '#00ce5a',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <ComplaintIcon />
              Government Application Form
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
              Please fill all required fields accurately
            </Typography>
            <Divider sx={{ bgcolor: '#00ce5a', height: 2 }} />
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Registration Type Selection */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: '#424242',
                  mb: 2,
                  pb: 1,
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  Registration Type
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <GovToggleButtonGroup
                    value={registrationType}
                    exclusive
                    onChange={handleRegistrationTypeChange}
                    aria-label="registration type"
                  >
                    <ToggleButton value="new" aria-label="new user">
                      <NewUserIcon sx={{ mr: 1 }} />
                      New Registration
                    </ToggleButton>
                    <ToggleButton value="existing" aria-label="existing user">
                      <ExistingUserIcon sx={{ mr: 1 }} />
                      Registered Before
                    </ToggleButton>
                  </GovToggleButtonGroup>
                </Box>

                <Alert 
                  severity="info" 
                  sx={{ 
                    borderRadius: 1,
                    bgcolor: '#e8f8f0',
                    border: '1px solid #b8e6c1',
                    '& .MuiAlert-icon': {
                      color: '#00ce5a'
                    }
                  }}
                >
                  {registrationType === 'new' ? (
                    <Typography variant="body2" sx={{ color: '#00a047' }}>
                      <strong>New Registration:</strong> Please fill in all your personal details below.
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#00a047' }}>
                      <strong>Existing User:</strong> Only provide your CNIC number. Your other details will be retrieved from our records.
                    </Typography>
                  )}
                </Alert>
              </Grid>

              {/* Personal Information Section - Only show for new users */}
              {registrationType === 'new' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{
                      fontWeight: 600,
                      color: '#424242',
                      mb: 2,
                      pb: 1,
                      borderBottom: '2px solid #e0e0e0'
                    }}>
                      Personal Information
                    </Typography>
                  </Grid>

                  {/* Name Field */}
                  <Grid item xs={12} md={6}>
                    <GovTextField
                      fullWidth
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your complete name as per CNIC"
                      variant="outlined"
                    />
                  </Grid>

                  {/* Phone Field */}
                  <Grid item xs={12} md={6}>
                    <GovTextField
                      fullWidth
                      label="Mobile Number"
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                      placeholder="+92-300-0000000"
                      variant="outlined"
                    />
                  </Grid>

                  {/* Email Field */}
                  <Grid item xs={12} md={6}>
                    <GovTextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      variant="outlined"
                    />
                  </Grid>

                  {/* Address Field */}
                  <Grid item xs={12} md={6}>
                    <GovTextField
                      fullWidth
                      label="Complete Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="House/Flat No., Street, Area, City, Province"
                      variant="outlined"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </>
              )}

              {/* CNIC Section - Always visible */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: '#424242',
                  mb: 2,
                  pb: 1,
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  {registrationType === 'existing' ? 'User Identification' : 'Identity Verification'}
                </Typography>
              </Grid>

              {/* CNIC Field */}
              <Grid item xs={12} md={6}>
                <GovTextField
                  fullWidth
                  label="CNIC Number"
                  value={cnic}
                  onChange={handleCNICChange}
                  required
                  placeholder="00000-0000000-0"
                  variant="outlined"
                  inputProps={{ maxLength: 15 }}
                />
              </Grid>

              {/* Application Information Section */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: '#424242',
                  mb: 2,
                  pb: 1,
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  Application Details
                </Typography>
              </Grid>

              {/* Application Type Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ fontWeight: 500 }}>Application Type</InputLabel>
                  <GovSelect
                    value={selectedApplicationType}
                    onChange={(e) => setSelectedApplicationType(e.target.value)}
                    label="Application Type"
                  >
                    <MenuItem value="">
                      <em>Select application type</em>
                    </MenuItem>
                    {applicationTypes.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </GovSelect>
                </FormControl>
              </Grid>

              {/* Officer Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ fontWeight: 500 }}>Select Officer</InputLabel>
                  <GovSelect
                    value={selectedOfficer}
                    onChange={(e) => setSelectedOfficer(e.target.value)}
                    label="Select Officer"
                  >
                    <MenuItem value="">
                      <em>Select an officer</em>
                    </MenuItem>
                    {officers.map((officer) => (
                      <MenuItem key={officer._id} value={officer._id}>
                        {officer.name} - {officer.designation}
                      </MenuItem>
                    ))}
                  </GovSelect>
                </FormControl>
              </Grid>

              {/* Application Description */}
              <Grid item xs={12}>
                <GovTextField
                  fullWidth
                  label="Application Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Please provide detailed information about your application including purpose, requirements, and any other relevant details..."
                  variant="outlined"
                  multiline
                  rows={6}
                  inputProps={{ maxLength: 1000 }}
                  helperText={`${description.length}/1000 characters`}
                  FormHelperTextProps={{
                    sx: {
                      color: description.length > 900 ? '#f57c00' : '#666',
                      fontWeight: description.length > 900 ? 600 : 400
                    }
                  }}
                />
              </Grid>

              {/* File Upload */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ 
                  mb: 2, 
                  fontWeight: 600, 
                  color: '#424242'
                }}>
                  Supporting Documents (Optional)
                </Typography>
                
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-upload"
                  disabled={uploading}
                />
                
                <label htmlFor="file-upload">
                  <UploadArea uploading={uploading}>
                    <Avatar sx={{
                      width: 56,
                      height: 56,
                      bgcolor: uploading ? '#f0f0f0' : '#e8f8f0',
                      color: uploading ? '#999' : '#00ce5a',
                      mx: 'auto',
                      mb: 2
                    }}>
                      {uploading ? (
                        <CircularProgress size={28} sx={{ color: '#00ce5a' }} />
                      ) : (
                        <CloudUploadIcon sx={{ fontSize: 28 }} />
                      )}
                    </Avatar>
                    
                    <Typography variant="h6" sx={{ mb: 1, color: uploading ? '#999' : '#424242' }}>
                      {uploading ? 'Uploading Files...' : 'Upload Supporting Documents'}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: uploading ? '#999' : '#666', mb: 1 }}>
                      {uploading ? 'Please wait while files are being uploaded' : 'Click to select files or drag and drop here'}
                    </Typography>
                    
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB each)
                    </Typography>
                  </UploadArea>
                </label>

                {/* Upload Progress */}
                {uploading && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: '#f0f0f0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#00ce5a'
                        }
                      }} 
                    />
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: '#666' }}>
                      Uploading files to secure server...
                    </Typography>
                  </Box>
                )}

                {/* Uploaded Files Display */}
                {attachments.length > 0 && (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      mt: 2, 
                      borderRadius: 1,
                      bgcolor: '#e8f8f0',
                      border: '1px solid #b8e6c1',
                      '& .MuiAlert-icon': {
                        color: '#00ce5a'
                      }
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#00a047', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 18 }} />
                      Successfully Uploaded Documents ({attachments.length}):
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {attachments.map((file, idx) => (
                        <Box 
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            bgcolor: 'white',
                            p: 2,
                            borderRadius: 1,
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                            <DescriptionIcon sx={{ color: '#00ce5a', fontSize: 20 }} />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: '#424242' }}>
                                {file.originalName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#666' }}>
                                {formatFileSize(file.size)} • {file.mimeType}
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveFile(idx)}
                            startIcon={<DeleteIcon />}
                            sx={{ minWidth: 'auto', p: 1 }}
                          >
                            Remove
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </Alert>
                )}
              </Grid>

              {/* Application Summary */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: '#424242',
                  mb: 2,
                  pb: 1,
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  Application Summary
                </Typography>
                
                <Box sx={{
                  bgcolor: '#f8f9fa',
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid #e9ecef'
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                        <strong>Applicant Name:</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#424242', mb: 2 }}>
                        {registrationType === 'new' ? (name || 'Not provided') : 'Existing User'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                        <strong>CNIC:</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#424242', mb: 2 }}>
                        {cnic || 'Not provided'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                        <strong>Application Type:</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#424242', mb: 2 }}>
                        {applicationTypes.find(t => t._id === selectedApplicationType)?.name || 'Not selected'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                        <strong>Assigned Officer:</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#424242', mb: 2 }}>
                        {officers.find(o => o._id === selectedOfficer)?.name || 'Not selected'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                        <strong>Description:</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#424242', mb: 2 }}>
                        {description || 'Not provided'}
                      </Typography>
                    </Grid>

                    {attachments.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                          <strong>Attached Documents:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#424242' }}>
                          {attachments.length} file(s) uploaded successfully
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Grid>

              {/* Terms and Submit */}
              <Grid item xs={12}>
                <Alert severity="warning" sx={{ mb: 3, borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>Important:</strong> Providing false information is a punishable offense. 
                    Your application will be forwarded to the relevant department for processing and approval.
                  </Typography>
                </Alert>

                <GovButton
                  type="submit"
                  fullWidth
                  size="large"
                  startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  disabled={submitting || uploading}
                  sx={{ py: 2 }}
                >
                  {submitting ? 'Submitting Application...' : uploading ? 'Please wait - Files uploading...' : 'Submit Application'}
                </GovButton>
              </Grid>
            </Grid>
          </Box>
        </GovPaper>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={handleCloseConfirmDialog}
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: 2,
              border: '2px solid #00ce5a',
              minWidth: 400
            }
          }}
        >
          <DialogTitle 
            id="confirm-dialog-title"
            sx={{
              bgcolor: '#013f1b',
              color: 'white',
              textAlign: 'center',
              '& .MuiTypography-root': {
                fontWeight: 600
              }
            }}
          >
            Confirm Application Submission
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <DialogContentText id="confirm-dialog-description" sx={{ mb: 2 }}>
              Please review your application details before submitting. This action cannot be undone.
            </DialogContentText>
            
            <Box sx={{
              bgcolor: '#f8f9fa',
              p: 2,
              borderRadius: 1,
              border: '1px solid #e9ecef'
            }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                <strong>Application Summary:</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                <strong>Name:</strong> {registrationType === 'new' ? (name || 'Not provided') : 'Existing User'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                <strong>CNIC:</strong> {cnic || 'Not provided'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                <strong>Type:</strong> {applicationTypes.find(t => t._id === selectedApplicationType)?.name || 'Not selected'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                <strong>Officer:</strong> {officers.find(o => o._id === selectedOfficer)?.name || 'Not selected'}
              </Typography>
              {attachments.length > 0 && (
                <Typography variant="body2" sx={{ color: '#424242' }}>
                  <strong>Documents:</strong> {attachments.length} file(s) attached
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={handleCloseConfirmDialog} 
              variant="outlined"
              sx={{
                borderColor: '#00ce5a',
                color: '#00ce5a',
                '&:hover': {
                  borderColor: '#00a047',
                  bgcolor: '#e8f8f0'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSubmit} 
              variant="contained" 
              disabled={submitting}
              sx={{
                bgcolor: '#00ce5a',
                '&:hover': {
                  bgcolor: '#00a047'
                },
                '&:disabled': {
                  bgcolor: '#ccc'
                }
              }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Application'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>

        {/* Upload Error Snackbar */}
        <Snackbar
          open={!!uploadError}
          autoHideDuration={8000}
          onClose={handleCloseUploadError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseUploadError} severity="error" sx={{ width: '100%' }}>
            {uploadError}
          </Alert>
        </Snackbar>

      </Container>
    </Box>
  );
}