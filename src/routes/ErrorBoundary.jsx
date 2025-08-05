import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

// material-ui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// ==============================|| ELEMENT ERROR - COMMON ||============================== //

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <Alert color="error">Error 404 - This page doesn't exist!</Alert>;
    }

    if (error.status === 401) {
      return <Alert color="error">Error 401 - You aren't authorized to see this</Alert>;
    }

    if (error.status === 503) {
      return <Alert color="error">Error 503 - Looks like our API is down</Alert>;
    }

    if (error.status === 418) {
      return <Alert color="error">Error 418 - Contact administrator</Alert>;
    }
  }

  // Handle dynamic import errors
  if (error.message && error.message.includes('Failed to fetch dynamically imported module')) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Module Loading Error
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Failed to load the requested page. This might be due to a network issue or the module not being available.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 1 }}
          >
            Reload Page
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Alert severity="error">
        <Typography variant="h6" gutterBottom>
          Unexpected Error
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          An unexpected error occurred. Please try refreshing the page.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 1 }}
        >
          Reload Page
        </Button>
      </Alert>
    </Box>
  );
}
