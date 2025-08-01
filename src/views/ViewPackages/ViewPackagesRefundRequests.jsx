import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Chip,
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
  Select,
  InputLabel,
  FormControl,
  Grid
} from '@mui/material';
import { 
  Check as CheckIcon,
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon 
} from '@mui/icons-material';

// PART 1: API & UTILS SETUP
// -------------------------

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

// Utility function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// PART 2: COMPONENTS
// -----------------

// Filter Component
const FilterSection = ({ filters, setFilters, onApplyFilters }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>Filter Refund Requests</Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={filters.status}
              label="Status"
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                onApplyFilters();
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            id="date-from"
            label="From Date"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => {
              setFilters({ ...filters, dateFrom: e.target.value });
              onApplyFilters();
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            id="date-to"
            label="To Date"
            type="date"
            value={filters.dateTo}
            onChange={(e) => {
              setFilters({ ...filters, dateTo: e.target.value });
              onApplyFilters();
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={() => {
                setFilters({
                  status: 'all',
                  dateFrom: '',
                  dateTo: '',
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

// Refund Request Table Component
const RefundTable = ({ 
  ViewRefundRequests, 
  loading, 
  onApprove, 
  onReject 
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f8fafc' }}>
            <TableCell align="left">User</TableCell>
            <TableCell align="left">Package</TableCell>
            <TableCell align="left">Order Status</TableCell>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Amount</TableCell>
            <TableCell align="left">Reason</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                <CircularProgress size={24} />
              </TableCell>
            </TableRow>
          ) : ViewRefundRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="text.secondary">No refund requests found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            ViewRefundRequests.map((request) => (
              <TableRow key={request._id} hover>
                <TableCell align="left">
                  <Typography variant="body2" fontWeight="medium">
                    {request.user?.firstname || ''} {request.user?.lastname || ''}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {request.user?.email || 'No email provided'}
                  </Typography>
                </TableCell>
                <TableCell align="left">{request.order?.packageId?.name || 'N/A'}</TableCell>
                <TableCell align="left">{request.order?.status || 'N/A'}</TableCell>
                <TableCell align="left">{formatDate(request.createdAt)}</TableCell>
                <TableCell align="left">${request.amount?.toFixed(2) || '0.00'}</TableCell>
                <TableCell align="left">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      maxWidth: 200, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}
                  >
                    {request.reason || 'No reason provided'}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Chip
                    size="small"
                    label={request.status}
                    color={
                      request.status === 'approved' 
                        ? 'success' 
                        : request.status === 'rejected'
                          ? 'error'
                          : 'warning'
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  {request.status === 'pending' && (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        startIcon={<CheckIcon />}
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}
                        onClick={() => onApprove(request._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        startIcon={<CloseIcon />}
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ borderColor: 'error.main', color: 'error.main', '&:hover': { backgroundColor: 'error.light', borderColor: 'error.dark', color: 'error.dark' } }}
                        onClick={() => onReject(request._id)}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// PART 3: MAIN COMPONENT
// ----------------------

const ViewRefundRequests = () => {
  // State Management
  const [ViewRefundRequests, setViewRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchViewRefundRequests();
  }, [page, filters]);

  // API call to fetch refund requests
  const fetchViewRefundRequests = async () => {
    try {
      setLoading(true);
      
      // Build query params for admin/all endpoint
      let endpoint = `/api/refunds/admin/all?page=${page}&limit=10`;
      if (filters.status && filters.status !== 'all') {
        endpoint += `&status=${filters.status}`;
      }
      if (filters.dateFrom) {
        endpoint += `&from=${filters.dateFrom}`;
      }
      if (filters.dateTo) {
        endpoint += `&to=${filters.dateTo}`;
      }
      const response = await axiosInstance.get(endpoint);
      if (response.data && response.data.data && response.data.data.refunds) {
        setViewRefundRequests(response.data.data.refunds);
        if (response.data.data.pagination) {
          setTotalPages(response.data.data.pagination.pages);
        }
      } else {
        setViewRefundRequests([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || 'Failed to fetch refund requests');
      setLoading(false);
    }
  };

  // Handle refund approval
  const handleApproveRefund = async (refundId) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/api/refunds/admin/${refundId}`);
      setViewRefundRequests(
        ViewRefundRequests.map(req => 
          req._id === refundId ? { ...req, status: 'approved' } : req
        )
      );
      setSnackbar({
        open: true,
        message: 'Refund successfully approved',
        severity: 'success'
      });
      fetchViewRefundRequests();
    } catch (err) {
      if (axios.isCancel && axios.isCancel(err)) {
        console.error('Request canceled:', err.message);
      } else {
        console.error('API Error:', err);
      }
      let errorMessage = 'Failed to approve refund';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      setLoading(false);
    }
  };

  // Handle refund rejection
  const handleRejectRefund = async (refundId) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/api/refunds/${refundId}`);
      // Update the local state
      setViewRefundRequests(
        ViewRefundRequests.map(req => 
          req._id === refundId ? { ...req, status: 'rejected' } : req
        )
      );
      setSnackbar({
        open: true,
        message: 'Refund request rejected',
        severity: 'info'
      });
      // Refresh the data
      fetchViewRefundRequests();
    } catch (err) {
      console.error("API Error:", err);
      let errorMessage = 'Failed to reject refund';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
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
        Refund Requests
      </Typography>
      
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
              {filters.status === 'all' ? 'All' : filters.status === 'approved' ? 'Approved' : filters.status === 'rejected' ? 'Rejected' : 'Pending'} Refund Requests
            </Typography>
            <Button 
              startIcon={<RefreshIcon />} 
              size="small"
              onClick={fetchViewRefundRequests}
            >
              Refresh
            </Button>
          </Box>
          
          {/* Error State */}
          {error ? (
            <Paper elevation={2} sx={{ p: 3, m: 2, textAlign: 'left', color: 'error.main' }}>
              <Typography>Error loading refund requests: {error}</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }} 
                onClick={() => fetchViewRefundRequests()}
              >
                Retry
              </Button>
            </Paper>
          ) : (
            <>
              {/* Refund Table */}
              <RefundTable 
                ViewRefundRequests={ViewRefundRequests}
                loading={loading}
                onApprove={handleApproveRefund}
                onReject={handleRejectRefund}
              />
              
              {/* Pagination */}
              {ViewRefundRequests.length > 0 && (
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

export default ViewRefundRequests;