import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { 
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Public as GlobalIcon,
  Map as RegionalIcon,
  LocationOn as LocalIcon
} from '@mui/icons-material';

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'https://esim.codistan.org',
  timeout: 10000,
});

// Request interceptor to add headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Filter Component
const FilterSection = ({ filters, setFilters, onApplyFilters }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>Filter Countries</Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="region-filter-label">Region</InputLabel>
            <Select
              labelId="region-filter-label"
              id="region-filter"
              value={filters.region}
              label="Region"
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            >
              <MenuItem value="all">All Regions</MenuItem>
              <MenuItem value="europe">Europe</MenuItem>
              <MenuItem value="asia">Asia</MenuItem>
              <MenuItem value="americas">Americas</MenuItem>
              <MenuItem value="africa">Africa</MenuItem>
              <MenuItem value="oceania">Oceania</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="metric-filter-label">Sort By</InputLabel>
            <Select
              labelId="metric-filter-label"
              id="metric-filter"
              value={filters.metric}
              label="Sort By"
              onChange={(e) => setFilters({ ...filters, metric: e.target.value })}
            >
              <MenuItem value="sales">Sales Volume</MenuItem>
              <MenuItem value="revenue">Revenue</MenuItem>
              <MenuItem value="users">User Count</MenuItem>
              <MenuItem value="growth">Growth Rate</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            id="date-range"
            label="Time Period"
            select
            value={filters.timePeriod}
            onChange={(e) => setFilters({ ...filters, timePeriod: e.target.value })}
          >
            <MenuItem value="7">Last 7 days</MenuItem>
            <MenuItem value="30">Last 30 days</MenuItem>
            <MenuItem value="90">Last 90 days</MenuItem>
            <MenuItem value="365">Last year</MenuItem>
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<FilterIcon />}
              onClick={onApplyFilters}
            >
              Apply
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={() => {
                setFilters({
                  region: 'all',
                  metric: 'sales',
                  timePeriod: '30',
                });
                onApplyFilters();
              }}
            >
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Stats Cards Component
const StatsCards = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Countries
            </Typography>
            <Typography variant="h4" component="div">
              {stats.totalCountries}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Sales
            </Typography>
            <Typography variant="h4" component="div">
              {stats.totalSales}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Revenue
            </Typography>
            <Typography variant="h4" component="div">
              ${stats.totalRevenue}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Growth Rate
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.growthRate}% <TrendingUpIcon color="success" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Countries Table Component
const CountriesTable = ({ countries, loading }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f8fafc' }}>
            <TableCell align="left">Country</TableCell>
            <TableCell align="left">Region</TableCell>
            <TableCell align="left">Sales</TableCell>
            <TableCell align="left">Revenue</TableCell>
            <TableCell align="left">Users</TableCell>
            <TableCell align="left">Growth Rate</TableCell>
            <TableCell align="left">Popular Packages</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                <CircularProgress size={24} />
              </TableCell>
            </TableRow>
          ) : countries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="text.secondary">No country data found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            countries.map((country) => (
              <TableRow key={country.id} hover>
                <TableCell align="left">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight="medium">
                      {country.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="left">{country.region}</TableCell>
                <TableCell align="left">{country.sales}</TableCell>
                <TableCell align="left">${country.revenue}</TableCell>
                <TableCell align="left">{country.users}</TableCell>
                <TableCell align="left">
                  <Chip
                    size="small"
                    label={`${country.growthRate}%`}
                    color={
                      country.growthRate > 10 
                        ? 'success' 
                        : country.growthRate > 0
                          ? 'info'
                          : 'error'
                    }
                  />
                </TableCell>
                <TableCell align="left">
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {country.popularPackages.map((pkg, idx) => (
                      <Chip
                        key={idx}
                        label={pkg}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Main Component
const ViewTopCountries = () => {
  // State Management
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    region: 'all',
    metric: 'sales',
    timePeriod: '30',
  });
  const [stats, setStats] = useState({
    totalCountries: 0,
    totalSales: 0,
    totalRevenue: 0,
    growthRate: 0
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Mock data - Replace with actual API fetching
  useEffect(() => {
    fetchCountries();
  }, [page]);

  // Mock function to fetch countries - Replace with actual API call
  const fetchCountries = async () => {
    try {
      setLoading(true);
      
      // This would be an actual API call in production
      // const response = await axiosInstance.get(`/api/analytics/countries?page=${page}&...`);
      
      // For now, use mock data
      setTimeout(() => {
        const mockCountries = [
          {
            id: 1,
            name: 'United States',
            region: 'Americas',
            sales: 12453,
            revenue: '145,230.00',
            users: 8976,
            growthRate: 15.3,
            popularPackages: ['Global Pro', 'Americas Premium']
          },
          {
            id: 2,
            name: 'India',
            region: 'Asia',
            sales: 9872,
            revenue: '98,450.00',
            users: 7654,
            growthRate: 24.8,
            popularPackages: ['Asia Value', 'Global Basic']
          },
          {
            id: 3,
            name: 'United Kingdom',
            region: 'Europe',
            sales: 7632,
            revenue: '84,560.00',
            users: 5432,
            growthRate: 8.2,
            popularPackages: ['Europe Premium', 'UK Special']
          },
          {
            id: 4,
            name: 'Japan',
            region: 'Asia',
            sales: 5421,
            revenue: '65,340.00',
            users: 4321,
            growthRate: 6.7,
            popularPackages: ['Asia Premium', 'Global Pro']
          },
          {
            id: 5,
            name: 'Germany',
            region: 'Europe',
            sales: 4987,
            revenue: '58,760.00',
            users: 3987,
            growthRate: 5.3,
            popularPackages: ['Europe Value', 'Germany Special']
          },
          {
            id: 6,
            name: 'Canada',
            region: 'Americas',
            sales: 3654,
            revenue: '43,230.00',
            users: 2876,
            growthRate: 7.9,
            popularPackages: ['Americas Premium', 'Canada Basic']
          },
          {
            id: 7,
            name: 'Australia',
            region: 'Oceania',
            sales: 3210,
            revenue: '39,870.00',
            users: 2543,
            growthRate: 9.5,
            popularPackages: ['Oceania Premium', 'Global Pro']
          },
          {
            id: 8,
            name: 'France',
            region: 'Europe',
            sales: 2987,
            revenue: '36,540.00',
            users: 2345,
            growthRate: 4.8,
            popularPackages: ['Europe Premium', 'France Special']
          },
          {
            id: 9,
            name: 'Brazil',
            region: 'Americas',
            sales: 2765,
            revenue: '31,230.00',
            users: 2143,
            growthRate: 12.6,
            popularPackages: ['Americas Value', 'Global Basic']
          },
          {
            id: 10,
            name: 'South Korea',
            region: 'Asia',
            sales: 2543,
            revenue: '29,870.00',
            users: 1987,
            growthRate: 10.7,
            popularPackages: ['Asia Premium', 'Korea Special']
          }
        ];
        
        setCountries(mockCountries);
        setTotalPages(3); // Mock pagination
        
        // Set mock statistics
        setStats({
          totalCountries: 195,
          totalSales: '54,326',
          totalRevenue: '632,590.00',
          growthRate: 12.7
        });
        
        setLoading(false);
      }, 800);
      
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || 'Failed to fetch country data');
      setLoading(false);
    }
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle apply filters button click
  const handleApplyFilters = () => {
    setPage(1); // Reset to first page when applying filters
    fetchCountries();
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Page Title */}
      <Typography 
        variant="h5" 
        component="h1" 
        fontWeight="bold" 
        sx={{ mb: 3 }}
        align="left"
      >
        Top Countries
      </Typography>
      
      {/* Stats Cards */}
      <StatsCards stats={stats} />
      
      {/* Filter Section */}
      <FilterSection 
        filters={filters} 
        setFilters={setFilters} 
        onApplyFilters={handleApplyFilters} 
      />
      
      {/* Main Content */}
      <Paper elevation={0} sx={{ borderRadius: 2 }}>
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Table Header */}
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="medium" align="left">
              Countries by {filters.metric === 'sales' ? 'Sales Volume' : 
                          filters.metric === 'revenue' ? 'Revenue' : 
                          filters.metric === 'users' ? 'User Count' : 'Growth Rate'}
            </Typography>
            <Button 
              startIcon={<RefreshIcon />} 
              size="small"
              onClick={fetchCountries}
            >
              Refresh
            </Button>
          </Box>
          
          {/* Error State */}
          {error ? (
            <Paper elevation={2} sx={{ p: 3, m: 2, textAlign: 'left', color: 'error.main' }}>
              <Typography>Error loading country data: {error}</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }} 
                onClick={() => fetchCountries()}
              >
                Retry
              </Button>
            </Paper>
          ) : (
            <>
              {/* Countries Table */}
              <CountriesTable 
                countries={countries}
                loading={loading}
              />
              
              {/* Pagination */}
              {countries.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  p: 2, 
                  borderTop: '1px solid #e2e8f0' 
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Page {page} of {totalPages}
                  </Typography>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary" 
                    size="small"
                  />
                </Box>
              )}
            </>
          )}
        </Paper>
      </Paper>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewTopCountries;