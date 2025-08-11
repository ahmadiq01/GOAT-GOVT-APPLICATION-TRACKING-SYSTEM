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
  Grid,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'https://SAHOOLAT APP.codistan.org',
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

// Filter Component
const FilterSection = ({ filters, setFilters, onApplyFilters }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>Filter Users</Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="role-filter-label">Role</InputLabel>
            <Select
              labelId="role-filter-label"
              id="role-filter"
              value={filters.role}
              label="Role"
              onChange={(e) => {
                setFilters({ ...filters, role: e.target.value });
                onApplyFilters();
              }}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="super_admin">Super Admin</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="officer">Officer</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
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
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Search Users"
            value={filters.search}
            onChange={(e) => {
              setFilters({ ...filters, search: e.target.value });
            }}
            placeholder="Name or email..."
          />
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
                  role: 'all',
                  status: 'all',
                  search: '',
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
              Total Users
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.totalUsers}
              <PersonIcon color="primary" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Users
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.activeUsers}
              <CheckCircleIcon color="success" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Officers
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.officers}
              <SecurityIcon color="info" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Admins
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.admins}
              <AdminIcon color="warning" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// User Edit Dialog Component
const UserEditDialog = ({ open, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    status: '',
    department: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || '',
        status: user.status || '',
        department: user.department || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value="super_admin">Super Admin</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="officer">Officer</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

// Users Table Component
const UsersTable = ({ 
  users, 
  loading, 
  onEdit, 
  onDelete,
  onToggleStatus
}) => {
  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin':
        return <AdminIcon color="error" />;
      case 'admin':
        return <AdminIcon color="warning" />;
      case 'officer':
        return <SecurityIcon color="info" />;
      case 'user':
        return <PersonIcon color="primary" />;
      default:
        return <PersonIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'error';
      case 'admin':
        return 'warning';
      case 'officer':
        return 'info';
      case 'user':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f8fafc' }}>
            <TableCell align="left">User</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Role</TableCell>
            <TableCell align="left">Department</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Last Login</TableCell>
            <TableCell align="left">Created Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                <CircularProgress size={24} />
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="text.secondary">No users found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell align="left">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {user.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="left">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getRoleIcon(user.role)}
                    <Chip
                      size="small"
                      label={user.role.replace('_', ' ').toUpperCase()}
                      color={getRoleColor(user.role)}
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="left">{user.department}</TableCell>
                <TableCell align="left">
                  <Chip
                    size="small"
                    label={user.status}
                    color={getStatusColor(user.status)}
                    variant="filled"
                  />
                </TableCell>
                <TableCell align="left">
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                </TableCell>
                <TableCell align="left">{formatDate(user.createdAt)}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(user)}
                      title="Edit User"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color={user.status === 'active' ? 'warning' : 'success'}
                      onClick={() => onToggleStatus(user.id, user.status)}
                      title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                    >
                      {user.status === 'active' ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(user.id)}
                      title="Delete User"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
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
const ViewUserManagement = () => {
  // State Management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: '',
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    officers: 0,
    admins: 0
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data for demonstration
  const mockUsers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@admin.com',
      role: 'super_admin',
      department: 'Administration',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2023-06-15T08:00:00Z'
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@admin.com',
      role: 'admin',
      department: 'Operations',
      status: 'active',
      lastLogin: '2024-01-14T16:45:00Z',
      createdAt: '2023-07-20T09:15:00Z'
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Davis',
      email: 'michael.davis@officer.com',
      role: 'officer',
      department: 'Immigration',
      status: 'active',
      lastLogin: '2024-01-15T14:20:00Z',
      createdAt: '2023-08-10T11:30:00Z'
    },
    {
      id: 4,
      firstName: 'Emily',
      lastName: 'Wilson',
      email: 'emily.wilson@officer.com',
      role: 'officer',
      department: 'Visa Processing',
      status: 'active',
      lastLogin: '2024-01-15T09:15:00Z',
      createdAt: '2023-09-05T10:45:00Z'
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@user.com',
      role: 'user',
      department: 'Customer Service',
      status: 'inactive',
      lastLogin: '2024-01-10T13:20:00Z',
      createdAt: '2023-10-12T14:00:00Z'
    },
    {
      id: 6,
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'lisa.anderson@officer.com',
      role: 'officer',
      department: 'Document Review',
      status: 'active',
      lastLogin: '2024-01-15T12:30:00Z',
      createdAt: '2023-11-08T15:20:00Z'
    },
    {
      id: 7,
      firstName: 'Robert',
      lastName: 'Taylor',
      email: 'robert.taylor@admin.com',
      role: 'admin',
      department: 'IT Support',
      status: 'suspended',
      lastLogin: '2024-01-05T11:15:00Z',
      createdAt: '2023-12-01T16:30:00Z'
    },
    {
      id: 8,
      firstName: 'Jennifer',
      lastName: 'Garcia',
      email: 'jennifer.garcia@user.com',
      role: 'user',
      department: 'Customer Service',
      status: 'active',
      lastLogin: '2024-01-15T15:45:00Z',
      createdAt: '2024-01-02T08:30:00Z'
    }
  ];

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [page, filters]);

  // API call to fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll use mock data
      // In production, this would be an actual API call
      setTimeout(() => {
        let filteredUsers = [...mockUsers];
        
        // Apply filters
        if (filters.role && filters.role !== 'all') {
          filteredUsers = filteredUsers.filter(user => user.role === filters.role);
        }
        if (filters.status && filters.status !== 'all') {
          filteredUsers = filteredUsers.filter(user => user.status === filters.status);
        }
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredUsers = filteredUsers.filter(user => 
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
          );
        }

        setUsers(filteredUsers);
        setTotalPages(Math.ceil(filteredUsers.length / 10));
        
        // Calculate stats
        const activeCount = filteredUsers.filter(user => user.status === 'active').length;
        const officersCount = filteredUsers.filter(user => user.role === 'officer').length;
        const adminsCount = filteredUsers.filter(user => 
          user.role === 'admin' || user.role === 'super_admin'
        ).length;
        
        setStats({
          totalUsers: filteredUsers.length,
          activeUsers: activeCount,
          officers: officersCount,
          admins: adminsCount
        });
        
        setLoading(false);
      }, 800);
      
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  // Handle save user
  const handleSaveUser = async (userData) => {
    try {
      // In production, this would be an API call
      if (selectedUser) {
        // Update existing user
        setUsers(users.map(user => 
          user.id === selectedUser.id ? { ...user, ...userData } : user
        ));
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success'
        });
      } else {
        // Add new user
        const newUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...userData,
          createdAt: new Date().toISOString(),
          lastLogin: null
        };
        setUsers([...users, newUser]);
        setSnackbar({
          open: true,
          message: 'User added successfully',
          severity: 'success'
        });
      }
      
      setSelectedUser(null);
      
    } catch (err) {
      console.error("API Error:", err);
      setSnackbar({
        open: true,
        message: 'Failed to save user',
        severity: 'error'
      });
    }
  };

  // Handle toggle user status
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      
      // In production, this would be an API call
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      setSnackbar({
        open: true,
        message: `User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`,
        severity: 'success'
      });
      
    } catch (err) {
      console.error("API Error:", err);
      setSnackbar({
        open: true,
        message: 'Failed to update user status',
        severity: 'error'
      });
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      // In production, this would be an API call
      setUsers(users.filter(user => user.id !== userId));
      
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
      
    } catch (err) {
      console.error("API Error:", err);
      setSnackbar({
        open: true,
        message: 'Failed to delete user',
        severity: 'error'
      });
    }
  };

  // Handle add new user
  const handleAddUser = () => {
    setSelectedUser(null);
    setEditDialogOpen(true);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          fontWeight="bold"
          align="left"
        >
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Box>
      
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
              {filters.role === 'all' ? 'All' : filters.role.replace('_', ' ').toUpperCase()} Users
            </Typography>
            <Button 
              startIcon={<RefreshIcon />} 
              size="small"
              onClick={fetchUsers}
            >
              Refresh
            </Button>
          </Box>
          
          {/* Error State */}
          {error ? (
            <Paper elevation={2} sx={{ p: 3, m: 2, textAlign: 'left', color: 'error.main' }}>
              <Typography>Error loading users: {error}</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }} 
                onClick={() => fetchUsers()}
              >
                Retry
              </Button>
            </Paper>
          ) : (
            <>
              {/* Users Table */}
              <UsersTable 
                users={users}
                loading={loading}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onToggleStatus={handleToggleStatus}
              />
              
              {/* Pagination */}
              {users.length > 0 && (
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
      
      {/* User Edit Dialog */}
      <UserEditDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSaveUser}
      />
      
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

export default ViewUserManagement;