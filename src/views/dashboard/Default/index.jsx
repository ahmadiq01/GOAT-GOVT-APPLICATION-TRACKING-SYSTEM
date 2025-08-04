import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  HourglassEmpty as HourglassEmptyIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Inventory as PackageIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';

// Function to get user role from localStorage
const getUserRole = () => {
  try {
    const userRole = localStorage.getItem('userRole');
    return userRole ? userRole.toLowerCase() : null;
  } catch (error) {
    console.error('Error reading user role:', error);
    return null;
  }
};

// Stats Cards Component following packages styling
const StatsCards = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Applications
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.totalApplications}
              <AssignmentIcon color="primary" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Completed
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.completed}
              <CheckCircleIcon color="success" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Pending
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.pending}
              <PendingIcon color="warning" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              In Process
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.inProcess}
              <HourglassEmptyIcon color="info" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// User-specific stats cards
const UserStatsCards = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={4}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              My Applications
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.myApplications}
              <AssignmentIcon color="primary" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              My Orders
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.myOrders}
              <ShoppingCartIcon color="success" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Available Packages
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.availablePackages}
              <PackageIcon color="info" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Dummy data for posts table
const dummyPosts = [
  {
    id: 1,
    title: 'New Package Launch',
    author: 'John Doe',
    status: 'Published',
    date: '2024-01-15',
    views: 1250
  },
  {
    id: 2,
    title: 'Updated Pricing Strategy',
    author: 'Jane Smith',
    status: 'Draft',
    date: '2024-01-14',
    views: 890
  },
  {
    id: 3,
    title: 'Customer Success Story',
    author: 'Mike Johnson',
    status: 'Published',
    date: '2024-01-13',
    views: 2100
  },
  {
    id: 4,
    title: 'Technical Documentation',
    author: 'Sarah Wilson',
    status: 'Review',
    date: '2024-01-12',
    views: 567
  },
  {
    id: 5,
    title: 'Marketing Campaign Results',
    author: 'David Brown',
    status: 'Published',
    date: '2024-01-11',
    views: 1890
  },
  {
    id: 6,
    title: 'Product Update Announcement',
    author: 'Lisa Chen',
    status: 'Published',
    date: '2024-01-10',
    views: 3200
  },
  {
    id: 7,
    title: 'User Guide Release',
    author: 'Tom Wilson',
    status: 'Draft',
    date: '2024-01-09',
    views: 450
  },
  {
    id: 8,
    title: 'Security Update Notice',
    author: 'Alex Rodriguez',
    status: 'Published',
    date: '2024-01-08',
    views: 1780
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Published':
      return 'success';
    case 'Draft':
      return 'warning';
    case 'Review':
      return 'info';
    default:
      return 'default';
  }
};

// Posts Table Component following packages styling
const PostsTable = ({ posts, loading }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayPosts = posts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="subtitle1" fontWeight="medium" align="left">
          Recent Posts ({posts.length} total)
        </Typography>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell align="left">Title</TableCell>
              <TableCell align="left">Author</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Views</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : displayPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No posts found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayPosts.map((post) => (
                <TableRow key={post.id} hover>
                  <TableCell align="left">
                    <Typography variant="body2" fontWeight="medium">
                      {post.title}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">{post.author}</TableCell>
                  <TableCell align="left">
                    <Chip
                      label={post.status}
                      color={getStatusColor(post.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="left">{post.date}</TableCell>
                  <TableCell align="left">
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      {post.views.toLocaleString()}
                      <TrendingUpIcon color="success" sx={{ ml: 1, fontSize: 16 }} />
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={posts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        showFirstButton
        showLastButton
      />
    </Paper>
  );
};

const Dashboard = () => {
  const stats = {
    totalApplications: 1234,
    completed: 856,
    pending: 234,
    inProcess: 144
  };

  const userRole = getUserRole();
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const isUser = userRole === 'user';

  // User-specific stats
  const userStats = {
    myApplications: 5,
    myOrders: 12,
    availablePackages: 25
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {isAdmin ? (
        <>
          {/* Admin Stats Cards */}
          <StatsCards stats={stats} />

          {/* Posts Table */}
          <PostsTable posts={dummyPosts} loading={false} />
        </>
      ) : isUser ? (
        <>
          {/* User-specific Stats Cards */}
          <UserStatsCards stats={userStats} />

          {/* Welcome message for users */}
          <Alert severity="info" sx={{ mb: 3 }}>
            Welcome to your dashboard! Here you can view your applications, orders, and available packages.
          </Alert>

          {/* Posts Table - simplified for users */}
          <PostsTable posts={dummyPosts} loading={false} />
        </>
      ) : (
        <Alert severity="warning">
          Unable to determine user role. Please contact support.
        </Alert>
      )}
    </Box>
  );
};

export default Dashboard;
