import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data for applications
const mockApplications = [
  {
    id: 1,
    applicantName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    applicationType: 'Business License',
    submissionDate: '2024-01-15',
    status: 'Pending',
    priority: 'High',
    documents: ['ID Card', 'Business Plan', 'Financial Statement'],
    description: 'Application for new business license in downtown area'
  },
  {
    id: 2,
    applicantName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1-555-0124',
    applicationType: 'Building Permit',
    submissionDate: '2024-01-14',
    status: 'In Review',
    priority: 'Medium',
    documents: ['Property Deed', 'Architectural Plans', 'Engineering Report'],
    description: 'Renovation permit for commercial building'
  },
  {
    id: 3,
    applicantName: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1-555-0125',
    applicationType: 'Event Permit',
    submissionDate: '2024-01-13',
    status: 'Approved',
    priority: 'Low',
    documents: ['Event Details', 'Security Plan', 'Insurance Certificate'],
    description: 'Annual community festival permit'
  },
  {
    id: 4,
    applicantName: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1-555-0126',
    applicationType: 'Food License',
    submissionDate: '2024-01-12',
    status: 'Rejected',
    priority: 'High',
    documents: ['Health Certificate', 'Menu Plan', 'Kitchen Layout'],
    description: 'Food truck license application'
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'success';
    case 'Rejected':
      return 'error';
    case 'In Review':
      return 'info';
    case 'Pending':
      return 'warning';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'success';
    default:
      return 'default';
  }
};

const AdminApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState(mockApplications);
  const [filteredApplications, setFilteredApplications] = useState(mockApplications);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Filter applications based on search and filters
  useEffect(() => {
    let filtered = applications.filter(app => {
      const matchesSearch = 
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicationType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || app.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    setFilteredApplications(filtered);
    setPage(0);
  }, [searchTerm, statusFilter, priorityFilter, applications]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewApplication = (applicationId) => {
    navigate(`/app/admin/applications/${applicationId}`);
  };

  const handleProcessApplication = (applicationId) => {
    navigate(`/app/admin/applications/${applicationId}/process`);
  };

  const handleRefresh = () => {
    // In real app, this would fetch fresh data from API
    setApplications([...mockApplications]);
  };

  const displayApplications = filteredApplications.slice(
    page * rowsPerPage, 
    page * rowsPerPage + rowsPerPage
  );

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Received Applications
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card elevation={0} variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant={showFilters ? "contained" : "outlined"}
                  startIcon={<FilterIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filters
                </Button>
                {(statusFilter !== 'All' || priorityFilter !== 'All') && (
                  <Button variant="text" onClick={clearFilters}>
                    Clear
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Filter Options */}
          {showFilters && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="All">All Statuses</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In Review">In Review</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={priorityFilter}
                      label="Priority"
                      onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                      <MenuItem value="All">All Priorities</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Applications ({filteredApplications.length} total)
          </Typography>
        </Box>
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell>Applicant</TableCell>
                <TableCell>Application Type</TableCell>
                <TableCell>Submission Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Documents</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No applications found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayApplications.map((app) => (
                  <TableRow key={app.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {app.applicantName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {app.email}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {app.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {app.applicationType}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {app.description}
                      </Typography>
                    </TableCell>
                    <TableCell>{app.submissionDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={app.status} 
                        color={getStatusColor(app.status)} 
                        size="small" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={app.priority} 
                        color={getPriorityColor(app.priority)} 
                        size="small" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {app.documents.length} document(s)
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewApplication(app.id)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Process Application">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleProcessApplication(app.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredApplications.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          showFirstButton
          showLastButton
        />
      </Paper>
    </Box>
  );
};

export default AdminApplications;
