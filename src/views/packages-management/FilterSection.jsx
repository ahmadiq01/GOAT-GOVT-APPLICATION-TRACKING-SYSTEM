import React, { useState, useEffect } from 'react';
import { Box, Button, Chip, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { FilterAlt as FilterIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const FilterSection = ({ filters, setFilters, uniqueRegions, allCountries }) => {
  const [innerFilters, setInnerFilters] = useState(filters);

  useEffect(() => {
    setInnerFilters(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setInnerFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setFilters(innerFilters);
  };

  const handleResetFilters = (e) => {
    e.preventDefault();
    const resetFilters = {
      validityDays: '',
      priceUSD: '',
      region: '',
      type: '',
      unlimited: '',
      destinationCountry: '',
      dataVolume: '',
      name: ''
    };
    setInnerFilters(resetFilters);
    setFilters(resetFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2">Filter Packages</Typography>
        {activeFiltersCount > 0 && (
          <Chip 
            label={`${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        )}
      </Box>
      <Box component="form" onSubmit={handleFilterSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="type-filter-label">Type</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                value={innerFilters.type}
                label="Type"
                name="type"
                onChange={handleFilterChange}
                displayEmpty={false}
                fullWidth
                sx={{
                  '& .MuiSelect-select': {
                    paddingRight: '32px !important',
                  },
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="global">Global</MenuItem>
                <MenuItem value="region">Regional</MenuItem>
                <MenuItem value="country">Country</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {innerFilters.type === 'region' && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="region-filter-label">Region</InputLabel>
                <Select
                  labelId="region-filter-label"
                  id="region-filter"
                  value={innerFilters.region}
                  label="Region"
                  name="region"
                  onChange={handleFilterChange}
                  displayEmpty={false}
                  fullWidth
                  sx={{
                    '& .MuiSelect-select': {
                      paddingRight: '32px !important',
                    },
                  }}
                >
                  <MenuItem value="">All Regions</MenuItem>
                  {uniqueRegions.map(region => (
                    <MenuItem key={region} value={region}>{region}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {innerFilters.type === 'country' && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="destination-country-label">Destination Country</InputLabel>
                <Select
                  labelId="destination-country-label"
                  id="destination-country-select"
                  name="destinationCountry"
                  value={innerFilters.destinationCountry || ''}
                  label="Destination Country"
                  onChange={handleFilterChange}
                  displayEmpty={false}
                  fullWidth
                  sx={{
                    '& .MuiSelect-select': {
                      paddingRight: '32px !important',
                    },
                  }}
                >
                  <MenuItem value="">All Countries</MenuItem>
                  {allCountries.map(country => (
                    <MenuItem key={country} value={country}>{country}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="unlimited-filter-label">Unlimited</InputLabel>
              <Select
                labelId="unlimited-filter-label"
                id="unlimited-filter"
                value={innerFilters.unlimited}
                label="Unlimited"
                name="unlimited"
                onChange={e => {
                  let value = e.target.value;
                  if (value === '') value = '';
                  else if (value === 'true') value = true;
                  else if (value === 'false') value = false;
                  setInnerFilters(prev => ({ ...prev, unlimited: value }));
                }}
                displayEmpty={false}
                fullWidth
                sx={{
                  '& .MuiSelect-select': {
                    paddingRight: '32px !important',
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Validity (Days)"
              name="validityDays"
              type="number"
              value={innerFilters.validityDays || ''}
              onChange={handleFilterChange}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Price ($)"
              name="priceUSD"
              type="number"
              value={innerFilters.priceUSD || ''}
              onChange={handleFilterChange}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1, height: '40px' }}>
              <Button 
                variant="contained" 
                startIcon={<FilterIcon />}
                type="submit"
                sx={{ flex: 1, minWidth: 0 }}
                size="small"
              >
                Apply
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />}
                onClick={handleResetFilters}
                type="button"
                sx={{ flex: 1, minWidth: 0 }}
                size="small"
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default FilterSection;