import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, InputLabel, OutlinedInput, TextField, Select, MenuItem, Typography, Grid } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';

const applicationTypes = [
  'Type A',
  'Type B',
  'Type C',
  'Other',
];

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
    // Submission logic will be added later
    // For now, just log the state
    console.log({ name, cnic, phone, email, address, applicationType, description, attachments });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>Registration Form</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="name">Name</InputLabel>
            <OutlinedInput
              id="name"
              label="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="cnic">CNIC</InputLabel>
            <OutlinedInput
              id="cnic"
              label="CNIC"
              value={cnic}
              onChange={e => setCnic(e.target.value)}
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="phone">Phone</InputLabel>
            <OutlinedInput
              id="phone"
              label="Phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="address">Address</InputLabel>
            <OutlinedInput
              id="address"
              label="Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
            <InputLabel id="application-type-label">Application Type</InputLabel>
            <Select
              labelId="application-type-label"
              id="application-type"
              value={applicationType}
              label="Application Type"
              onChange={e => setApplicationType(e.target.value)}
              required
            >
              {applicationTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            multiline
            minRows={3}
            fullWidth
            value={description}
            onChange={e => setDescription(e.target.value)}
            sx={{ ...theme.typography.customInput }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            Upload Attachments
            <input
              type="file"
              hidden
              multiple
              onChange={handleFileChange}
            />
          </Button>
          {attachments.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">Selected files:</Typography>
              <ul>
                {attachments.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            </Box>
          )}
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button
                color="secondary"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Register
              </Button>
            </AnimateButton>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}
