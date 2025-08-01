import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Grid, 
  InputAdornment, 
  MenuItem, 
  Modal, 
  TextField, 
  Typography,
  Tabs,
  Tab,
  Divider,
  Alert,
  Switch,
  FormControl,
  InputLabel,
  Select,
  Chip
} from '@mui/material';

const EnhancedPackageForm = ({ 
  isModalOpen, 
  setIsModalOpen, 
  formData, 
  setFormData, 
  selectedPackage, 
  allPackages,
  onBulkUpdate 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [localFormData, setLocalFormData] = useState({ ...formData });
  
  // Filter states
  const [filters, setFilters] = useState({
    country: '',
    region: '',
    unlimited: null, // null = not selected, true = unlimited, false = limited
    fixedCost: ''
  });
  
  // Price update states
  const [priceUpdate, setPriceUpdate] = useState({
    updateType: 'percentage', // 'percentage' or 'fixed'
    updateValue: ''
  });
  
  // Available options for dropdowns
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [filteredCount, setFilteredCount] = useState(0);

  useEffect(() => {
    setLocalFormData({ ...formData });
  }, [formData]);

  useEffect(() => {
    // Extract unique countries and regions from all packages
    const countries = new Set();
    const regions = new Set();
    (allPackages || []).forEach(pkg => {
      if (pkg && Array.isArray(pkg.destinationCountries)) {
        pkg.destinationCountries.forEach(country => countries.add(country));
      }
      if (pkg && pkg.region) {
        regions.add(pkg.region);
      }
    });
    setAvailableCountries(Array.from(countries).sort());
    setAvailableRegions(Array.from(regions).sort());
  }, [allPackages]);

  // Calculate filtered packages count
  useEffect(() => {
    if (activeTab === 1) { // Only calculate when on filter tab
      const filtered = allPackages.filter(pkg => {
        let matches = true;
        
        if (filters.country && pkg.destinationCountries && !pkg.destinationCountries.includes(filters.country)) {
          matches = false;
        }
        if (filters.region && pkg.region !== filters.region) {
          matches = false;
        }
        if (filters.unlimited !== null) {
          const isUnlimited = pkg.dataVolume && pkg.dataVolume.toLowerCase().includes('unlimited');
          if (filters.unlimited && !isUnlimited) matches = false;
          if (!filters.unlimited && isUnlimited) matches = false;
        }
        if (filters.fixedCost && pkg.priceUSD !== parseFloat(filters.fixedCost)) {
          matches = false;
        }
        
        return matches;
      });
      
      setFilteredCount(filtered.length);
    }
  }, [filters, allPackages, activeTab]);

  const handleClose = () => {
    setIsModalOpen(false);
    // Reset states
    setActiveTab(0);
    setFilters({
      country: '',
      region: '',
      unlimited: null,
      fixedCost: ''
    });
    setPriceUpdate({
      updateType: 'percentage',
      updateValue: ''
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLocalFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setLocalFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUnlimitedChange = (value) => {
    setFilters(prev => ({
      ...prev,
      unlimited: value
    }));
  };

  const handlePriceUpdateChange = (e) => {
    const { name, value } = e.target;
    setPriceUpdate(prev => ({
      ...prev,
      [name]: value
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
    
    // Handle regular package add/update
    if (selectedPackage) {
      // handleUpdatePackage(localFormData);
    } else {
      // handleAddPackage(localFormData);
    }
  };

  const handleBulkPriceUpdate = () => {
    if (!priceUpdate.updateValue || parseFloat(priceUpdate.updateValue) <= 0) {
      alert('Please enter a valid update value');
      return;
    }

    // Check if any filters are applied or if we're updating all packages
    const hasFilters = filters.country || filters.region || filters.unlimited !== null || filters.fixedCost;
    
    if (!hasFilters && filteredCount === 0) {
      // No filters applied, will update all packages
      setFilteredCount(allPackages.length);
    }

    const updateData = {
      filters,
      updateType: priceUpdate.updateType,
      updateValue: parseFloat(priceUpdate.updateValue)
    };

    onBulkUpdate(updateData);
    handleClose();
  };

  const clearFilters = () => {
    setFilters({
      country: '',
      region: '',
      unlimited: null,
      fixedCost: ''
    });
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
        maxWidth: 700,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <Typography variant="h5" component="h2" mb={3} align="left">
          {selectedPackage ? 'Edit Package' : 'Add New Package'}
        </Typography>
        
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Package Details" />
          <Tab label="Bulk Price Update" />
        </Tabs>

        {activeTab === 0 && (
          <Box component="form" onSubmit={handleFormSubmit}>
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
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Filter Packages & Update Prices
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              {priceUpdate.updateType === 'percentage' ? 
                `This will increase all selected package prices by ${priceUpdate.updateValue}%` :
                `This will increase all selected package prices by ${priceUpdate.updateValue}`
              }
            </Alert>

            {/* Filters Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Package Filters
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select
                      name="country"
                      value={filters.country}
                      onChange={handleFilterChange}
                      label="Country"
                    >
                      <MenuItem value="">All Countries</MenuItem>
                      {availableCountries.map(country => (
                        <MenuItem key={country} value={country}>{country}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Region</InputLabel>
                    <Select
                      name="region"
                      value={filters.region}
                      onChange={handleFilterChange}
                      label="Region"
                    >
                      <MenuItem value="">All Regions</MenuItem>
                      {availableRegions.map(region => (
                        <MenuItem key={region} value={region}>{region}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">Data Type:</Typography>
                    <Chip 
                      label="Unlimited" 
                      color={filters.unlimited === true ? 'primary' : 'default'}
                      variant={filters.unlimited === true ? 'filled' : 'outlined'}
                      onClick={() => handleUnlimitedChange(filters.unlimited === true ? null : true)}
                      sx={{ cursor: 'pointer' }}
                    />
                    <Chip 
                      label="Limited" 
                      color={filters.unlimited === false ? 'primary' : 'default'}
                      variant={filters.unlimited === false ? 'filled' : 'outlined'}
                      onClick={() => handleUnlimitedChange(filters.unlimited === false ? null : false)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Fixed Cost ($)"
                    name="fixedCost"
                    type="number"
                    value={filters.fixedCost}
                    onChange={handleFilterChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    inputProps={{ step: "0.01" }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Button variant="outlined" onClick={clearFilters} size="small">
                  Clear Filters
                </Button>
                <Typography variant="body2" color="textSecondary">
                  {filteredCount > 0 ? `${filteredCount} packages match your filters` : 
                   (filters.country || filters.region || filters.unlimited !== null || filters.fixedCost) ? 
                   'No packages match your filters' : 
                   `All ${allPackages.length} packages will be updated`}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Price Update Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Price Update Settings
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Update Type</InputLabel>
                    <Select
                      name="updateType"
                      value={priceUpdate.updateType}
                      onChange={handlePriceUpdateChange}
                      label="Update Type"
                    >
                      <MenuItem value="percentage">Percentage Increase</MenuItem>
                      <MenuItem value="fixed">Fixed Amount Increase</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={priceUpdate.updateType === 'percentage' ? 'Increase Percentage' : 'Increase Amount'}
                    name="updateValue"
                    type="number"
                    value={priceUpdate.updateValue}
                    onChange={handlePriceUpdateChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">
                        {priceUpdate.updateType === 'percentage' ? '%' : '$'}
                      </InputAdornment>,
                    }}
                    inputProps={{ 
                      step: priceUpdate.updateType === 'percentage' ? "0.1" : "0.01",
                      min: "0"
                    }}
                    required
                  />
                </Grid>
              </Grid>
              
              {priceUpdate.updateValue && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {priceUpdate.updateType === 'percentage' ? 
                    `This will increase all selected package prices by ${priceUpdate.updateValue}%` :
                    `This will increase all selected package prices by ${priceUpdate.updateValue}`
                  }
                </Alert>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBulkPriceUpdate}
                disabled={!priceUpdate.updateValue || parseFloat(priceUpdate.updateValue) <= 0}
              >
                Apply Price Update
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default EnhancedPackageForm;
