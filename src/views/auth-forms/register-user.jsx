import React, { useState } from 'react';
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
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  CloudUpload as CloudUploadIcon,
  Check as CheckIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const applicationTypes = [
  'Type A',
  'Type B',
  'Type C',
  'Other',
];

// Styled components for custom styling
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  border: `1px solid ${theme.palette.success.light}`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: theme.palette.grey[50],
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.common.white,
      '& fieldset': {
        borderColor: theme.palette.success.main,
        borderWidth: '2px',
      }
    }
  }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.grey[50],
  '&:hover': {
    backgroundColor: theme.palette.common.white,
  },
  '&.Mui-focused': {
    backgroundColor: theme.palette.common.white,
  }
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.success.light}`,
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.grey[50],
  '&:hover': {
    borderColor: theme.palette.success.main,
    backgroundColor: theme.palette.success[50],
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 'bold',
  textTransform: 'none',
  boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.success.dark}, ${theme.palette.success[800]})`,
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 24px rgba(76, 175, 80, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0)',
  }
}));

export default function RegisterUser() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [applicationType, setApplicationType] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, cnic, phone, email, address, applicationType, description, attachments });
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e8 0%, #ffffff 50%, #e8f5e8 100%)',
      py: 6,
      px: 2
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          
          <Typography variant="h3" component="h1" sx={{
            fontWeight: 'bold',
            color: 'grey.800',
            mb: 2
          }}>
            Register Your Application
          </Typography>
          
          <Typography variant="h6" sx={{
            color: 'grey.600',
            mb: 2
          }}>
            Please fill out all required information below
          </Typography>
          
          <Box sx={{
            width: 96,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.success.light}, ${theme.palette.success.dark})`,
            mx: 'auto',
            borderRadius: 2
          }} />
        </Box>

        {/* Form Card */}
        <StyledPaper elevation={0}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Name Field */}
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  variant="outlined"
                />
              </Grid>

              {/* CNIC Field */}
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="CNIC"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  required
                  placeholder="00000-0000000-0"
                  variant="outlined"
                />
              </Grid>

              {/* Phone Field */}
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+92 300 0000000"
                  variant="outlined"
                />
              </Grid>

              {/* Email Field */}
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  variant="outlined"
                />
              </Grid>

              {/* Address Field */}
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Enter your complete address"
                  variant="outlined"
                />
              </Grid>

              {/* Application Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Application Type</InputLabel>
                  <StyledSelect
                    value={applicationType}
                    onChange={(e) => setApplicationType(e.target.value)}
                    label="Application Type"
                  >
                    {applicationTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </Grid>

              {/* Description Field */}
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Please provide a detailed description of your application..."
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Grid>

              {/* File Upload */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'grey.700' }}>
                  Attachments
                </Typography>
                
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                
                <label htmlFor="file-upload">
                  <UploadBox>
                    <Avatar sx={{
                      width: 64,
                      height: 64,
                      bgcolor: 'success.100',
                      color: 'success.main',
                      mx: 'auto',
                      mb: 2
                    }}>
                      <CloudUploadIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    
                    <Typography variant="h6" sx={{ mb: 1, color: 'grey.700' }}>
                      Upload Attachments
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: 'grey.500' }}>
                      Click to browse or drag and drop files here
                    </Typography>
                  </UploadBox>
                </label>

                {attachments.length > 0 && (
                  <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Selected files:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {attachments.map((file, idx) => (
                        <Chip
                          key={idx}
                          label={file.name}
                          icon={<DescriptionIcon />}
                          variant="outlined"
                          color="success"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Alert>
                )}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ mt: 4 }}>
                  <GradientButton
                    type="submit"
                    fullWidth
                    size="large"
                    startIcon={<CheckIcon />}
                  >
                    Register Application
                  </GradientButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>

        {/* Footer */}
        {/* <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            All fields marked with * are required
          </Typography>
        </Box> */}
      </Container>
    </Box>
  );
}