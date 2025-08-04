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

// Import axios instance with dynamic URL support (commented out for now)
// import { makeRequest } from '../../utils/axiosInstance'; // Custom axios instance for API requests

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize useNavigate

  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('superadmin'); // Can be username, email, or NIC
  const [password, setPassword] = useState('SuperAdmin123!'); // Pre-fill for testing
  const [loading, setLoading] = useState(false); // Loading state for form submission

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Direct API endpoint
  const endpoint = 'http://localhost:3000/api/auth/login';

  // Function to handle form submission with direct fetch call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct fetch call to the API
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.success) {
        const user = data.data.user;
        const userRole = user.role?.toLowerCase();
        const isAuthorized = userRole === 'admin' || userRole === 'superadmin' || userRole === 'user';

        if (isAuthorized) {
          const token = data.data.token;
          // Store token and user info in localStorage for authenticated requests
          localStorage.setItem("token", token);
          localStorage.setItem("userRole", user.role);
          localStorage.setItem("userData", JSON.stringify(user));

          toast.success(`Login successful! Welcome ${user.role}. Redirecting to dashboard...`);
          navigate('/dashboard');
        } else {
          toast.error('Access denied! Admin, SuperAdmin, or User privileges required.');
        }
      } else {
        const errorMessage = data.message || 'Login failed! Please check your credentials.';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error during login:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Network error! Please check if the server is running on localhost:3000');
      } else {
        toast.error('Something went wrong! Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-username-login">Username / Email / NIC</InputLabel>
        <OutlinedInput
          id="outlined-adornment-username-login"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          name="username"
          required
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-login"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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