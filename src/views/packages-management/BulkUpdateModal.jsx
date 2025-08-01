import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Grid, 
  InputAdornment, 
  MenuItem, 
  Modal, 
  Typography,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Divider,
  Card,
  CardContent
} from '@mui/material';

const BulkUpdateModal = ({ isOpen, onClose, allPackages, onBulkUpdate }) => {
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
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    if (allPackages.length > 0) {
      // Extract unique countries and regions from all packages
      const countries = new Set();
      const regions = new Set();
      
      allPackages.forEach(pkg => {
        if (pkg.destinationCountries && Array.isArray(pkg.destinationCountries)) {
          pkg.destinationCountries.forEach(country => countries.add(country));
        }
        if (pkg.region) {
          regions.add(pkg.region);
        }
      });
      
      setAvailableCountries(Array.from(countries).sort());
      setAvailableRegions(Array.from(regions).sort());
    }
  }, [allPackages]);

  // Calculate filtered packages
  useEffect(() => {
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
    
    setFilteredPackages(filtered);
  }, [filters, allPackages]);

  const handleClose = () => {
    onClose();
    // Reset states
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
    setPreviewVisible(false);
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

  const handleBulkPriceUpdate = () => {
    if (!priceUpdate.updateValue || parseFloat(priceUpdate.updateValue) <= 0) {
      alert('Please enter a valid update value');
      return;
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

  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  // Calculate preview data
  const getPreviewData = () => {
    if (!priceUpdate.updateValue) return [];
    
    const packagesToUpdate = filteredPackages.length > 0 ? filteredPackages : allPackages;
    
    return packagesToUpdate.slice(0, 5).map(pkg => {
      const currentPrice = parseFloat(pkg.priceUSD) || 0;
      let newPrice;
      
      if (priceUpdate.updateType === 'percentage') {
        newPrice = currentPrice * (1 + parseFloat(priceUpdate.updateValue) / 100);
      } else {
        newPrice = currentPrice + parseFloat(priceUpdate.updateValue);
      }
      
      return {
        ...pkg,
        currentPrice,
        newPrice: Math.max(0, newPrice).toFixed(2)
      };
    });
  };

  const hasFilters = filters.country || filters.region || filters.unlimited !== null || filters.fixedCost;
  const packagesToUpdate = hasFilters ? filteredPackages : allPackages;

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="bulk-update-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: 800,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <Typography variant="h5" component="h2" mb={3} align="left">
          Bulk Update Package Prices
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          Use filters to target specific packages, or leave empty to update all packages
        </Alert>

        {/* Filters Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
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
                {hasFilters ? 
                  `${filteredPackages.length} packages match your filters` : 
                  `All ${allPackages.length} packages will be updated`}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Price Update Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
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
              <Alert severity="success" sx={{ mt: 2 }}>
                {priceUpdate.updateType === 'percentage' ? 
                  `This will increase prices by ${priceUpdate.updateValue}% for ${packagesToUpdate.length} packages` :
                  `This will increase prices by $${priceUpdate.updateValue} for ${packagesToUpdate.length} packages`
                }
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Preview Section */}
        {priceUpdate.updateValue && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Price Update Preview
                </Typography>
                <Button variant="outlined" onClick={togglePreview} size="small">
                  {previewVisible ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </Box>
              
              {previewVisible && (
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Showing first 5 packages that will be updated:
                  </Typography>
                  
                  {getPreviewData().map((pkg, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      py: 1,
                      px: 2,
                      bgcolor: index % 2 === 0 ? 'grey.50' : 'transparent',
                      borderRadius: 1
                    }}>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {pkg.name || 'Package Name'}
                      </Typography>
                      <Typography variant="body2" sx={{ minWidth: 80 }}>
                        ${pkg.currentPrice.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" sx={{ mx: 1 }}>
                        →
                      </Typography>
                      <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 'bold', color: 'primary.main' }}>
                        ${pkg.newPrice}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBulkPriceUpdate}
            disabled={!priceUpdate.updateValue || parseFloat(priceUpdate.updateValue) <= 0 || packagesToUpdate.length === 0}
          >
            Update {packagesToUpdate.length} Package{packagesToUpdate.length !== 1 ? 's' : ''}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BulkUpdateModal;