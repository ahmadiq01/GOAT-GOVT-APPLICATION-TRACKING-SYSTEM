import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom'; // Import Link for navigation
import { toast } from 'react-toastify'; // Import toast from react-toastify

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Import axios instance with dynamic URL support
import { makeRequest } from '../../utils/axiosInstance'; // Make sure the import path is correct

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize useNavigate

  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(''); // Email state
  const [password, setPassword] = useState(''); // Password state
  const [loading, setLoading] = useState(false); // Loading state for form submission

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Dynamic endpoint for login
  const endpoint = 'login'; // Change this dynamically (e.g., 'register', 'login', etc.)

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await makeRequest(endpoint, 'POST', {
        email: email,
        password: password,
        isAdmin: true // You may keep or remove this depending on how your backend works
      });
      
      console.log('Login response:', response.data);
      
      // Check if login is successful
      if (response.data.success) {
        const userRole = response.data.user.role.roleName;
        const isAdmin = response.data.user.isAdmin;
        
        // Allow login for both Admin and SuperAdmin roles
        if (userRole === 'Admin' || userRole === 'SuperAdmin') {
          console.log('Access token:', response.data.accessToken);
          localStorage.setItem("token", response.data.accessToken);
          localStorage.setItem("userRole", JSON.stringify(response.data.user.role));
          
          // Store additional user info if needed
          localStorage.setItem("userData", JSON.stringify(response.data.user));
          
          toast.success(`Login successful! Welcome ${userRole}. Redirecting to dashboard...`);
          console.log('User role:', userRole);
          console.log('User data:', response.data.user);
          
          navigate('/dashboard');
        } else {
          toast.error('Access denied! Admin or SuperAdmin privileges required.');
        }
      } else {
        toast.error('Login failed! Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Login failed! Please check your credentials.';
        toast.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        toast.error('Network error! Please check your connection.');
      } else {
        // Something else happened
        toast.error('Something went wrong! Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}> {/* Use onSubmit for the form */}
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-login"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          name="email"
          required
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-login"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          name="password"
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>

      <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Grid>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
            label="Keep me logged in"
          />
        </Grid>
        <Grid>
          <Typography variant="subtitle1" component={Link} to="/forgot-password" color="secondary" sx={{ textDecoration: 'none' }}>
            Forgot Password?
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            color="secondary"
            fullWidth
            size="large"
            type="submit"  // Use "submit" to trigger form submission
            variant="contained"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}