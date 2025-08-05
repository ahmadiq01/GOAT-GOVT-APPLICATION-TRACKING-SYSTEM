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
  CircularProgress
} from '@mui/material';
import {
  AccountBalance as GovIcon,
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  Description as DescriptionIcon,
  Warning as ComplaintIcon
} from '@mui/icons-material';
import { axiosInstance } from '../../utils/axiosInstance';

// Removed complaintTypes array as we'll use application types from API

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

const UploadArea = styled(Box)(({ theme }) => ({
  border: `2px dashed #00ce5a`,
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: '#ffffff',
  '&:hover': {
    borderColor: '#00a047',
    backgroundColor: '#e8f8f0',
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

export default function ComplaintRegistrationForm() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [complaintDetails, setComplaintDetails] = useState('');
  const [attachments, setAttachments] = useState([]);
  
  // New state for API data
  const [officers, setOfficers] = useState([]);
  const [applicationTypes, setApplicationTypes] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [selectedApplicationType, setSelectedApplicationType] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Fetch officers and application types on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setApiError('');
      
      try {
        // Fetch officers
        const officersResponse = await axiosInstance.get('/officers');
        setOfficers(officersResponse.data?.data || []);
        
        // Fetch application types
        const applicationTypesResponse = await axiosInstance.get('/application-types');
        setApplicationTypes(applicationTypesResponse.data?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setApiError('Failed to load form data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ 
      name, 
      cnic, 
      phone, 
      email, 
      address, 
      complaintDetails, 
      attachments,
      selectedOfficer,
      selectedApplicationType
    });
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
            Public Complaint Registration System
          </Typography>
          
          <Typography variant="body1" sx={{
            opacity: 0.8,
            maxWidth: 600,
            mx: 'auto',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            color: 'white'
          }}>
            Submit your complaint online for prompt resolution by relevant authorities
          </Typography>
        </HeaderBox>

        {/* API Error Alert */}
        {apiError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {apiError}
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
              Complaint Registration Form
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
              Please fill all required fields accurately
            </Typography>
            <Divider sx={{ bgcolor: '#00ce5a', height: 2 }} />
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Personal Information Section */}
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

              {/* CNIC Field */}
              <Grid item xs={12} md={6}>
                <GovTextField
                  fullWidth
                  label="CNIC Number"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  required
                  placeholder="00000-0000000-0"
                  variant="outlined"
                  inputProps={{ maxLength: 15 }}
                />
              </Grid>

              {/* Phone Field */}
              <Grid item xs={12} md={6}>
                <GovTextField
                  fullWidth
                  label="Mobile Number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
              <Grid item xs={12}>
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

              {/* Complaint Information Section */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: '#424242',
                  mb: 2,
                  pb: 1,
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  Complaint Details
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

              {/* Complaint Details */}
              <Grid item xs={12}>
                <GovTextField
                  fullWidth
                  label="Detailed Complaint Description"
                  value={complaintDetails}
                  onChange={(e) => setComplaintDetails(e.target.value)}
                  required
                  placeholder="Please provide detailed information about your complaint including date, time, location, and any other relevant details..."
                  variant="outlined"
                  multiline
                  rows={6}
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
                />
                
                <label htmlFor="file-upload">
                  <UploadArea>
                    <Avatar sx={{
                      width: 56,
                      height: 56,
                      bgcolor: '#e8f8f0',
                      color: '#00ce5a',
                      mx: 'auto',
                      mb: 2
                    }}>
                      <CloudUploadIcon sx={{ fontSize: 28 }} />
                    </Avatar>
                    
                    <Typography variant="h6" sx={{ mb: 1, color: '#424242' }}>
                      Upload Supporting Documents
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      Click to select files or drag and drop here
                    </Typography>
                    
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB each)
                    </Typography>
                  </UploadArea>
                </label>

                {attachments.length > 0 && (
                  <Alert 
                    severity="info" 
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
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#00a047' }}>
                      Attached Documents ({attachments.length}):
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {attachments.map((file, idx) => (
                        <Chip
                          key={idx}
                          label={file.name}
                          icon={<DescriptionIcon />}
                          variant="outlined"
                          size="small"
                          sx={{ 
                            bgcolor: 'white',
                            borderColor: '#00ce5a',
                            color: '#00a047',
                            '& .MuiChip-icon': {
                              color: '#00ce5a'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Alert>
                )}
              </Grid>

              {/* Terms and Submit */}
              <Grid item xs={12}>
                <Alert severity="warning" sx={{ mb: 3, borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>Important:</strong> Providing false information is a punishable offense. 
                    Your complaint will be forwarded to the relevant department for investigation and resolution.
                  </Typography>
                </Alert>

                <GovButton
                  type="submit"
                  fullWidth
                  size="large"
                  startIcon={<SendIcon />}
                  sx={{ py: 2 }}
                >
                  Submit Complaint
                </GovButton>
              </Grid>
            </Grid>
          </Box>
        </GovPaper>

      </Container>
    </Box>
  );
}