import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  HourglassEmpty as HourglassEmptyIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  Restaurant as RestaurantIcon,
  Notifications as NotificationsIcon,
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data for admin dashboard
const mockStats = {
  totalApplications: 156,
  pending: 23,
  inReview: 45,
  approved: 67,
  rejected: 21,
  highPriority: 12,
  mediumPriority: 34,
  lowPriority: 110
};

const mockRecentApplications = [
  {
    id: 1,
    applicantName: 'John Doe',
    applicationType: 'Business License',
    status: 'Pending',
    priority: 'High',
    submissionDate: '2024-01-15',
    daysSinceSubmission: 2
  },
  {
    id: 2,
    applicantName: 'Jane Smith',
    applicationType: 'Building Permit',
    status: 'In Review',
    priority: 'Medium',
    submissionDate: '2024-01-14',
    daysSinceSubmission: 3
  },
  {
    id: 3,
    applicantName: 'Mike Johnson',
    applicationType: 'Event Permit',
    status: 'Pending',
    priority: 'Low',
    submissionDate: '2024-01-13',
    daysSinceSubmission: 4
  },
  {
    id: 4,
    applicantName: 'Sarah Wilson',
    applicationType: 'Food License',
    status: 'In Review',
    priority: 'High',
    submissionDate: '2024-01-12',
    daysSinceSubmission: 5
  }
];

const mockApplicationTypes = [
  { type: 'Business License', count: 45, icon: BusinessIcon },
  { type: 'Building Permit', count: 32, icon: AssignmentIcon },
  { type: 'Event Permit', count: 28, icon: EventIcon },
  { type: 'Food License', count: 23, icon: RestaurantIcon },
  { type: 'Other', count: 28, icon: AssignmentIcon }
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

const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'High':
      return '🔴';
    case 'Medium':
      return '🟡';
    case 'Low':
      return '🟢';
    default:
      return '⚪';
  }
};

const AdminDashboardWrapper = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(mockStats);
  const [recentApplications, setRecentApplications] = useState(mockRecentApplications);

  const handleViewApplications = () => {
    navigate('/admin/applications');
  };

  const handleViewApplication = (applicationId) => {
    navigate(`/admin/applications/${applicationId}`);
  };

  const handleProcessApplication = (applicationId) => {
    navigate(`/admin/applications/${applicationId}/process`);
  };

  const getUrgencyColor = (days) => {
    if (days <= 1) return 'error';
    if (days <= 3) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back! Here's an overview of your application processing activities.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Applications
              </Typography>
              <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                {stats.totalApplications}
                <AssignmentIcon color="primary" sx={{ ml: 1 }} />
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                All time applications
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Review
              </Typography>
              <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                {stats.pending}
                <PendingIcon color="warning" sx={{ ml: 1 }} />
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Need attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Review
              </Typography>
              <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                {stats.inReview}
                <HourglassEmptyIcon color="info" sx={{ ml: 1 }} />
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Currently processing
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Approved
              </Typography>
              <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                {stats.approved}
                <CheckCircleIcon color="success" sx={{ ml: 1 }} />
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Successfully processed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Priority Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Priority Distribution
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">High Priority</Typography>
                  <Chip 
                    label={stats.highPriority} 
                    color="error" 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Medium Priority</Typography>
                  <Chip 
                    label={stats.mediumPriority} 
                    color="warning" 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Low Priority</Typography>
                  <Chip 
                    label={stats.lowPriority} 
                    color="success" 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Application Types
              </Typography>
              <Grid container spacing={2}>
                {mockApplicationTypes.map((appType, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <appType.icon color="primary" sx={{ mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {appType.type}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {appType.count} applications
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Applications */}
      <Card elevation={0} variant="outlined" sx={{ borderRadius: 2, mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Recent Applications
            </Typography>
            <Button
              variant="contained"
              onClick={handleViewApplications}
              startIcon={<AssignmentIcon />}
            >
              View All Applications
            </Button>
          </Box>

          <List>
            {recentApplications.map((app, index) => (
              <React.Fragment key={app.id}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight="medium">
                          {app.applicantName}
                        </Typography>
                        <Chip 
                          label={app.applicationType} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Submitted {app.submissionDate} ({app.daysSinceSubmission} days ago)
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={app.status} 
                            color={getStatusColor(app.status)} 
                            size="small" 
                            variant="outlined" 
                          />
                          <Chip 
                            label={app.priority} 
                            color={getPriorityColor(app.priority)} 
                            size="small" 
                            variant="outlined" 
                          />
                          <Typography variant="caption" color="text.secondary">
                            {getPriorityIcon(app.priority)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <Box>
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
                </ListItem>
                {index < recentApplications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AssignmentIcon />}
                  onClick={handleViewApplications}
                >
                  Review Pending Applications
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<NotificationsIcon />}
                  onClick={() => navigate('/admin/feedback')}
                >
                  Manage Feedback
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<TrendingUpIcon />}
                  onClick={() => navigate('/admin/processing')}
                >
                  View Processing Queue
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Applications Pending</Typography>
                  <Chip 
                    label={stats.pending} 
                    color="warning" 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">High Priority Items</Typography>
                  <Chip 
                    label={stats.highPriority} 
                    color="error" 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Processing Rate</Typography>
                  <Chip 
                    label="85%" 
                    color="success" 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardWrapper;
