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
  Grid,
  Card,
  CardContent,
  IconButton,
  Badge
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Filter Component
const FilterSection = ({ filters, setFilters, onApplyFilters }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>Filter Notifications</Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="type-filter-label">Type</InputLabel>
            <Select
              labelId="type-filter-label"
              id="type-filter"
              value={filters.type}
              label="Type"
              onChange={(e) => {
                setFilters({ ...filters, type: e.target.value });
                onApplyFilters();
              }}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="new_application">New Application</MenuItem>
              <MenuItem value="status_update">Status Update</MenuItem>
              <MenuItem value="document_upload">Document Upload</MenuItem>
              <MenuItem value="deadline_alert">Deadline Alert</MenuItem>
              <MenuItem value="system_alert">System Alert</MenuItem>
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
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
              <MenuItem value="read">Read</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="priority-filter-label">Priority</InputLabel>
            <Select
              labelId="priority-filter-label"
              id="priority-filter"
              value={filters.priority}
              label="Priority"
              onChange={(e) => {
                setFilters({ ...filters, priority: e.target.value });
                onApplyFilters();
              }}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={() => {
                setFilters({
                  type: 'all',
                  status: 'all',
                  priority: 'all',
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
              Total Notifications
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.totalNotifications}
              <NotificationsIcon color="primary" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Unread
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge badgeContent={stats.unreadCount} color="error">
                {stats.unreadCount}
              </Badge>
              <NotificationsActiveIcon color="warning" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              High Priority
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.highPriority}
              <WarningIcon color="error" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Today's Alerts
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.todayAlerts}
              <InfoIcon color="info" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Notifications Table Component
const NotificationsTable = ({ 
  notifications, 
  loading, 
  onMarkAsRead, 
  onDelete 
}) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'new_application':
        return <NotificationsActiveIcon color="info" />;
      case 'status_update':
        return <CheckCircleIcon color="success" />;
      case 'document_upload':
        return <InfoIcon color="primary" />;
      case 'deadline_alert':
        return <WarningIcon color="warning" />;
      case 'system_alert':
        return <ErrorIcon color="error" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f8fafc' }}>
            <TableCell align="left">Type</TableCell>
            <TableCell align="left">Title</TableCell>
            <TableCell align="left">Message</TableCell>
            <TableCell align="left">Priority</TableCell>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                <CircularProgress size={24} />
              </TableCell>
            </TableRow>
          ) : notifications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="text.secondary">No notifications found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            notifications.map((notification) => (
              <TableRow 
                key={notification.id} 
                hover
                sx={{ 
                  backgroundColor: notification.isRead ? 'inherit' : '#f8f9fa',
                  '&:hover': {
                    backgroundColor: notification.isRead ? '#f5f5f5' : '#e9ecef'
                  }
                }}
              >
                <TableCell align="left">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTypeIcon(notification.type)}
                    <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                      {notification.type.replace('_', ' ')}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Typography 
                    variant="body2" 
                    fontWeight={notification.isRead ? 'normal' : 'bold'}
                  >
                    {notification.title}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      maxWidth: 300, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {notification.message}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Chip
                    size="small"
                    label={notification.priority}
                    color={getPriorityColor(notification.priority)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="left">{formatDate(notification.createdAt)}</TableCell>
                <TableCell align="left">
                  <Chip
                    size="small"
                    label={notification.isRead ? 'Read' : 'Unread'}
                    color={notification.isRead ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {!notification.isRead && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onMarkAsRead(notification.id)}
                        title="Mark as Read"
                      >
                        <MarkEmailReadIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(notification.id)}
                      title="Delete Notification"
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
const ViewNotificationCenter = () => {
  // State Management
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all',
  });
  const [stats, setStats] = useState({
    totalNotifications: 0,
    unreadCount: 0,
    highPriority: 0,
    todayAlerts: 0
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Mock data for demonstration
  const mockNotifications = [
    {
      id: 1,
      type: 'new_application',
      title: 'New Application Submitted',
      message: 'John Smith has submitted a new visa application for review.',
      priority: 'high',
      isRead: false,
      createdAt: '2024-01-15T10:30:00Z',
      applicationId: 'APP-001'
    },
    {
      id: 2,
      type: 'status_update',
      title: 'Application Status Changed',
      message: 'Application APP-002 status has been updated to "In Progress".',
      priority: 'medium',
      isRead: false,
      createdAt: '2024-01-15T09:15:00Z',
      applicationId: 'APP-002'
    },
    {
      id: 3,
      type: 'document_upload',
      title: 'New Document Uploaded',
      message: 'Sarah Williams uploaded additional documents for application APP-003.',
      priority: 'medium',
      isRead: true,
      createdAt: '2024-01-15T08:45:00Z',
      applicationId: 'APP-003'
    },
    {
      id: 4,
      type: 'deadline_alert',
      title: 'Application Deadline Approaching',
      message: 'Application APP-004 deadline is in 2 days. Immediate action required.',
      priority: 'high',
      isRead: false,
      createdAt: '2024-01-14T16:20:00Z',
      applicationId: 'APP-004'
    },
    {
      id: 5,
      type: 'system_alert',
      title: 'System Maintenance Scheduled',
      message: 'System maintenance is scheduled for tonight from 11 PM to 2 AM.',
      priority: 'low',
      isRead: true,
      createdAt: '2024-01-14T14:30:00Z',
      applicationId: null
    },
    {
      id: 6,
      type: 'new_application',
      title: 'New Application Submitted',
      message: 'Emily Johnson has submitted a student visa application.',
      priority: 'medium',
      isRead: false,
      createdAt: '2024-01-14T12:15:00Z',
      applicationId: 'APP-005'
    },
    {
      id: 7,
      type: 'status_update',
      title: 'Application Completed',
      message: 'Application APP-006 has been completed and approved.',
      priority: 'low',
      isRead: true,
      createdAt: '2024-01-14T11:00:00Z',
      applicationId: 'APP-006'
    },
    {
      id: 8,
      type: 'deadline_alert',
      title: 'Overdue Application',
      message: 'Application APP-007 is overdue. Please review immediately.',
      priority: 'high',
      isRead: false,
      createdAt: '2024-01-13T15:45:00Z',
      applicationId: 'APP-007'
    }
  ];

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchNotifications();
  }, [page, filters]);

  // API call to fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll use mock data
      // In production, this would be an actual API call
      setTimeout(() => {
        let filteredNotifications = [...mockNotifications];
        
        // Apply filters
        if (filters.type && filters.type !== 'all') {
          filteredNotifications = filteredNotifications.filter(notif => notif.type === filters.type);
        }
        if (filters.status && filters.status !== 'all') {
          if (filters.status === 'read') {
            filteredNotifications = filteredNotifications.filter(notif => notif.isRead);
          } else if (filters.status === 'unread') {
            filteredNotifications = filteredNotifications.filter(notif => !notif.isRead);
          }
        }
        if (filters.priority && filters.priority !== 'all') {
          filteredNotifications = filteredNotifications.filter(notif => notif.priority === filters.priority);
        }

        setNotifications(filteredNotifications);
        setTotalPages(Math.ceil(filteredNotifications.length / 10));
        
        // Calculate stats
        const unreadCount = filteredNotifications.filter(notif => !notif.isRead).length;
        const highPriorityCount = filteredNotifications.filter(notif => notif.priority === 'high').length;
        const today = new Date().toDateString();
        const todayAlertsCount = filteredNotifications.filter(notif => 
          new Date(notif.createdAt).toDateString() === today
        ).length;
        
        setStats({
          totalNotifications: filteredNotifications.length,
          unreadCount: unreadCount,
          highPriority: highPriorityCount,
          todayAlerts: todayAlertsCount
        });
        
        setLoading(false);
      }, 800);
      
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || 'Failed to fetch notifications');
      setLoading(false);
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      // In production, this would be an API call
      // await axiosInstance.put(`/api/notifications/${notificationId}/read`);
      
      setNotifications(
        notifications.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setSnackbar({
        open: true,
        message: 'Notification marked as read',
        severity: 'success'
      });
      
      // Update stats
      setStats(prev => ({
        ...prev,
        unreadCount: prev.unreadCount - 1
      }));
      
    } catch (err) {
      console.error("API Error:", err);
      setSnackbar({
        open: true,
        message: 'Failed to mark notification as read',
        severity: 'error'
      });
    }
  };

  // Handle delete notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      // In production, this would be an API call
      // await axiosInstance.delete(`/api/notifications/${notificationId}`);
      
      const notificationToDelete = notifications.find(notif => notif.id === notificationId);
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
      
      setSnackbar({
        open: true,
        message: 'Notification deleted successfully',
        severity: 'success'
      });
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalNotifications: prev.totalNotifications - 1,
        unreadCount: notificationToDelete && !notificationToDelete.isRead ? prev.unreadCount - 1 : prev.unreadCount
      }));
      
    } catch (err) {
      console.error("API Error:", err);
      setSnackbar({
        open: true,
        message: 'Failed to delete notification',
        severity: 'error'
      });
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
        Notification Center
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
              {filters.status === 'all' ? 'All' : filters.status === 'read' ? 'Read' : 'Unread'} Notifications
            </Typography>
            <Button 
              startIcon={<RefreshIcon />} 
              size="small"
              onClick={fetchNotifications}
            >
              Refresh
            </Button>
          </Box>
          
          {/* Error State */}
          {error ? (
            <Paper elevation={2} sx={{ p: 3, m: 2, textAlign: 'left', color: 'error.main' }}>
              <Typography>Error loading notifications: {error}</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }} 
                onClick={() => fetchNotifications()}
              >
                Retry
              </Button>
            </Paper>
          ) : (
            <>
              {/* Notifications Table */}
              <NotificationsTable 
                notifications={notifications}
                loading={loading}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
              />
              
              {/* Pagination */}
              {notifications.length > 0 && (
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

export default ViewNotificationCenter;