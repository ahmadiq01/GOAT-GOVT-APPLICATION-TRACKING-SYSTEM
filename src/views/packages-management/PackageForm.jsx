import React, { useState, useEffect } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Grid, InputAdornment, MenuItem, Modal, TextField, Typography } from '@mui/material';

const PackageForm = ({ isModalOpen, setIsModalOpen, formData, setFormData, selectedPackage, handleAddPackage, handleUpdatePackage }) => {
  const [localFormData, setLocalFormData] = useState({ ...formData });

  useEffect(() => {
    setLocalFormData({ ...formData });
  }, [formData]);

  const handleClose = () => setIsModalOpen(false);

  const handleLocalFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setLocalFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!localFormData.name || !localFormData.type || !localFormData.priceUSD || !localFormData.dataVolume || !localFormData.validityDays) {
      return;
    }
    if (localFormData.type !== 'global' && !localFormData.region) {
      return;
    }
    if (selectedPackage) {
      handleUpdatePackage(localFormData);
    } else {
      handleAddPackage(localFormData);
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="package-form-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <Typography id="package-form-modal" variant="h5" component="h2" mb={3} align="left">
          {selectedPackage ? 'Edit Package' : 'Add New Package'}
        </Typography>
        <Box component="form" sx={{ mt: 2 }} onSubmit={handleFormSubmit}>
          <TextField
            fullWidth
            label="Package Name"
            name="name"
            value={localFormData.name || ''}
            onChange={handleLocalFormChange}
            margin="normal"
            variant="outlined"
            required
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Type"
                name="type"
                value={localFormData.type || ''}
                onChange={handleLocalFormChange}
                variant="outlined"
                required
              >
                <MenuItem value="global">Global</MenuItem>
                <MenuItem value="region">Regional</MenuItem>
                <MenuItem value="country">Country</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price"
                name="priceUSD"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={localFormData.priceUSD || ''}
                onChange={handleLocalFormChange}
                variant="outlined"
                inputProps={{ step: "0.01" }}
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Data Allocation"
                name="dataVolume"
                value={localFormData.dataVolume || ''}
                onChange={handleLocalFormChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Validity (Days)"
                name="validityDays"
                type="number"
                value={localFormData.validityDays || ''}
                onChange={handleLocalFormChange}
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            label="Region"
            name="region"
            value={localFormData.region || ''}
            onChange={handleLocalFormChange}
            margin="normal"
            variant="outlined"
            required={localFormData.type !== 'global'}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={2}
            value={localFormData.description || ''}
            onChange={handleLocalFormChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Compatibility Note"
            name="compatibilityNote"
            value={localFormData.compatibilityNote || ''}
            onChange={handleLocalFormChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Destination Countries (comma separated)"
            name="destinationCountriesText"
            value={localFormData.type === 'global' ? 'Global Coverage' : (localFormData.destinationCountries || []).join(', ')}
            onChange={(e) => {
              const countries = e.target.value.split(',').map(country => country.trim());
              setLocalFormData(prev => ({
                ...prev,
                destinationCountries: countries
              }));
            }}
            margin="normal"
            variant="outlined"
            disabled={localFormData.type === 'global'}
          />
          <TextField
            fullWidth
            label="Tags (comma separated)"
            name="tagsText"
            value={(localFormData.tags || []).join(', ')}
            onChange={(e) => {
              const tags = e.target.value.split(',').map(tag => tag.trim());
              setLocalFormData(prev => ({
                ...prev,
                tags: tags
              }));
            }}
            margin="normal"
            variant="outlined"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="topUpAvailable"
                checked={localFormData.topUpAvailable || false}
                onChange={handleLocalFormChange}
              />
            }
            label="Top-Up Available"
            sx={{ mt: 2, display: 'block' }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="familyPackageAvailable"
                checked={localFormData.familyPackageAvailable || false}
                onChange={handleLocalFormChange}
              />
            }
            label="Family Package Available"
            sx={{ display: 'block' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              {selectedPackage ? 'Update' : 'Add'} Package
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default PackageForm; 