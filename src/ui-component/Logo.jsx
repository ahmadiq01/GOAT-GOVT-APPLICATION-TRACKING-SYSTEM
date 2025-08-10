// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

export default function Logo() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '190px',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography
        variant="h4"
        component="div"
        sx={{
          fontWeight: 'bold',
          color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: '0.5px'
        }}
      >
        ADMIN PANEL
      </Typography>
    </Box>
  );
}
