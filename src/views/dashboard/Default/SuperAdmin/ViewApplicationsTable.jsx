import React from 'react';
import { Box, Button, Chip, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography } from '@mui/material';
import { Refresh as RefreshIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, CloudDownload as DownloadIcon } from '@mui/icons-material';

const ViewApplicationsTable = ({ 
  displayApplications, 
  applications, 
  page, 
  rowsPerPage, 
  totalRecords,
  totalPages,
  handleChangePage, 
  handleChangeRowsPerPage, 
  handleEdit, 
  handleDeleteApplication, 
  getStatusIcon, 
  fetchApplications, 
  loading, 
  error 
}) => {

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'error';
      case 'High':
        return 'warning';
      case 'Normal':
        return 'info';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleViewDocuments = (documents) => {
    console.log('View documents:', documents);
    // In production, this would open a document viewer or download
  };

  const handleDownloadDocument = (docName) => {
    console.log('Download document:', docName);
    // In production, this would trigger file download
  };

  return (
    loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    ) : error ? (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'left', color: 'error.main' }}>
        <Typography>Error loading applications: {error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }} 
          onClick={() => fetchApplications()}
        >
          Retry
        </Button>
      </Paper>
    ) : (
      <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="medium" align="left">
            All Applications ({totalRecords} total)
          </Typography>
          <Button 
            startIcon={<RefreshIcon />} 
            size="small"
            onClick={() => fetchApplications()}
          >
            Refresh
          </Button>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell align="left">Applicant</TableCell>
                <TableCell align="left">Application Type</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left">Officer Assigned</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Priority</TableCell>
                <TableCell align="left">Submitted Date</TableCell>
                <TableCell align="left">Documents</TableCell>
                <TableCell align="left">Remarks</TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      {totalRecords === 0 ? 'No applications found' : 'No applications match the current filters'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayApplications.map((app) => (
                  <TableRow key={app._id} hover>
                    <TableCell align="left">
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {app.applicantName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {app.contactEmail}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2">
                        {app.applicationType}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 200, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={app.description}
                      >
                        {app.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2">
                        {app.officerAssigned}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Chip
                        size="small"
                        label={app.status}
                        color={getStatusColor(app.status)}
                        variant="outlined"
                        icon={<span>{getStatusIcon(app.status)}</span>}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Chip
                        size="small"
                        label={app.priority}
                        color={getPriorityColor(app.priority)}
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2">
                        {new Date(app.submittedDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="primary">
                          {app.attachedDocuments?.length || 0} files
                        </Typography>
                        {app.attachedDocuments?.length > 0 && (
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewDocuments(app.attachedDocuments)}
                            title="View Documents"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
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
                        title={app.remarks}
                      >
                        {app.remarks || 'No remarks'}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(app)}
                          title="Edit Application"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteApplication(app._id)}
                          title="Delete Application"
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
        
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          showFirstButton
          showLastButton
        />
      </Paper>
    )
  );
};

export default ViewApplicationsTable;