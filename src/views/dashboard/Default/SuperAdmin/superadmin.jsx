import React, { useState } from 'react';
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
  Button,
  IconButton
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const StatsCards = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2.4}>
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

      <Grid item xs={12} sm={6} md={2.4}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Submitted
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.submitted}
              <PendingIcon color="info" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Under Review
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.underReview}
              <HourglassEmptyIcon color="warning" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              In Progress
            </Typography>
            <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {stats.inProgress}
              <HourglassEmptyIcon color="info" sx={{ ml: 1 }} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
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
    </Grid>
  );
};

const dummyApplications = [
  { 
    id: 1, 
    applicantName: 'John Smith', 
    description: 'Visa Application for Tourism', 
    officerAssigned: 'Officer A. Johnson', 
    status: 'Under Review', 
    remarks: 'Initial review completed',
    submittedDate: '2024-01-15',
    attachedDocuments: ['passport.pdf', 'photo.jpg']
  },
  { 
    id: 2, 
    applicantName: 'Sarah Williams', 
    description: 'Business License Application', 
    officerAssigned: 'Officer M. Davis', 
    status: 'In Progress', 
    remarks: 'Awaiting additional documentation',
    submittedDate: '2024-01-14',
    attachedDocuments: ['business_plan.pdf', 'financial_statements.xlsx']
  },
  { 
    id: 3, 
    applicantName: 'Michael Brown', 
    description: 'Work Permit Application', 
    officerAssigned: 'Officer L. Wilson', 
    status: 'Completed', 
    remarks: 'Approved and processed',
    submittedDate: '2024-01-13',
    attachedDocuments: ['contract.pdf', 'qualifications.pdf', 'medical_report.pdf']
  },
  { 
    id: 4, 
    applicantName: 'Emily Johnson', 
    description: 'Student Visa Application', 
    officerAssigned: 'Officer R. Garcia', 
    status: 'Submitted', 
    remarks: 'Pending initial review',
    submittedDate: '2024-01-12',
    attachedDocuments: ['admission_letter.pdf', 'transcript.pdf']
  },
  { 
    id: 5, 
    applicantName: 'David Miller', 
    description: 'Immigration Application', 
    officerAssigned: 'Officer K. Martinez', 
    status: 'Rejected', 
    remarks: 'Missing required documentation',
    submittedDate: '2024-01-11',
    attachedDocuments: ['application_form.pdf']
  },
  { 
    id: 6, 
    applicantName: 'Lisa Anderson', 
    description: 'Property Registration', 
    officerAssigned: 'Officer T. Thompson', 
    status: 'Under Review', 
    remarks: 'Property verification in progress',
    submittedDate: '2024-01-10',
    attachedDocuments: ['property_deed.pdf', 'survey_report.pdf', 'valuation.pdf']
  },
  { 
    id: 7, 
    applicantName: 'Robert Taylor', 
    description: 'Tax Exemption Application', 
    officerAssigned: 'Officer S. White', 
    status: 'In Progress', 
    remarks: 'Tax assessment under review',
    submittedDate: '2024-01-09',
    attachedDocuments: ['tax_returns.pdf', 'financial_audit.pdf']
  },
  { 
    id: 8, 
    applicantName: 'Jennifer Wilson', 
    description: 'Medical License Renewal', 
    officerAssigned: 'Officer P. Lee', 
    status: 'Completed', 
    remarks: 'License renewed successfully',
    submittedDate: '2024-01-08',
    attachedDocuments: ['medical_certificate.pdf', 'cme_credits.pdf', 'malpractice_insurance.pdf']
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'In Progress':
      return 'info';
    case 'Under Review':
      return 'warning';
    case 'Submitted':
      return 'default';
    case 'Rejected':
      return 'error';
    default:
      return 'default';
  }
};

const ApplicationsTable = ({ applications, loading, onViewDetails, onEdit }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayApplications = applications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="subtitle1" fontWeight="medium" align="left">
          Recent Applications ({applications.length} total)
        </Typography>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell align="left">Applicant Name</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">Officer Assigned</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Submitted Date</TableCell>
              <TableCell align="left">Documents</TableCell>
              <TableCell align="left">Remarks</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : displayApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No applications found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayApplications.map((application) => (
                <TableRow key={application.id} hover>
                  <TableCell align="left">
                    <Typography variant="body2" fontWeight="medium">
                      {application.applicantName}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {application.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">{application.officerAssigned}</TableCell>
                  <TableCell align="left">
                    <Chip 
                      label={application.status} 
                      color={getStatusColor(application.status)} 
                      size="small" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell align="left">{application.submittedDate}</TableCell>
                  <TableCell align="left">
                    <Typography variant="body2" color="primary">
                      {application.attachedDocuments.length} files
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 150, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {application.remarks}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onViewDetails(application)}
                        title="View Details"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => onEdit(application)}
                        title="Edit Application"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
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
        count={applications.length}
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

const SuperAdminApplicationDashboard = ({ onManageApplications }) => {
  const stats = {
    totalApplications: 1856,
    submitted: 234,
    underReview: 412,
    inProgress: 567,
    completed: 643
  };

  const handleViewDetails = (application) => {
    console.log('View details for:', application);
    onManageApplications();
  };

  const handleEdit = (application) => {
    console.log('Edit application:', application);
    onManageApplications();
  };

  return (
    <>
      <StatsCards stats={stats} />
      <ApplicationsTable 
        applications={dummyApplications} 
        loading={false} 
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
      />
    </>
  );
};

export default SuperAdminApplicationDashboard;