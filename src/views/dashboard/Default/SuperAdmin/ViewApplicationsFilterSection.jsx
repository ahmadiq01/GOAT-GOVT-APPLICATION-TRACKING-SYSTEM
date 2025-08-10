import React, { useState, useEffect } from 'react';
import { Box, Button, Chip, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { FilterAlt as FilterIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const ViewApplicationsFilterSection = ({ filters, setFilters, uniqueOfficers, uniqueApplicationTypes, allOfficers, applicationTypes }) => {
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
      status: '',
      officerAssigned: '',
      applicationType: '',
      priority: '',
      dateFrom: '',
      dateTo: '',
      applicantName: ''
    };
    setInnerFilters(resetFilters);
    setFilters(resetFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2">Filter Applications</Typography>
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
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={innerFilters.status}
                label="Status"
                name="status"
                onChange={handleFilterChange}
                displayEmpty={false}
                fullWidth
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Submitted">Submitted</MenuItem>
                <MenuItem value="Under Review">Under Review</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="officer-filter-label">Officer Assigned</InputLabel>
              <Select
                labelId="officer-filter-label"
                id="officer-filter"
                value={innerFilters.officerAssigned}
                label="Officer Assigned"
                name="officerAssigned"
                onChange={handleFilterChange}
                displayEmpty={false}
                fullWidth
              >
                <MenuItem value="">All Officers</MenuItem>
                {allOfficers.map(officer => (
                  <MenuItem key={officer} value={officer}>{officer}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="type-filter-label">Application Type</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                value={innerFilters.applicationType}
                label="Application Type"
                name="applicationType"
                onChange={handleFilterChange}
                displayEmpty={false}
                fullWidth
              >
                <MenuItem value="">All Types</MenuItem>
                {applicationTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="priority-filter-label">Priority</InputLabel>
              <Select
                labelId="priority-filter-label"
                id="priority-filter"
                value={innerFilters.priority}
                label="Priority"
                name="priority"
                onChange={handleFilterChange}
                displayEmpty={false}
                fullWidth
              >
                <MenuItem value="">All Priorities</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Applicant Name"
              name="applicantName"
              value={innerFilters.applicantName || ''}
              onChange={handleFilterChange}
              placeholder="Search by name..."
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="From Date"
              name="dateFrom"
              type="date"
              value={innerFilters.dateFrom || ''}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="To Date"
              name="dateTo"
              type="date"
              value={innerFilters.dateTo || ''}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
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

export default ViewApplicationsFilterSection;