import React from 'react';
import { Box, Button, Chip, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography } from '@mui/material';
import { Refresh as RefreshIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ViewPackagesTable = ({ 
  displayPackages, 
  packages, 
  page, 
  rowsPerPage, 
  totalRecords, // This is the key prop you need to use
  totalPages,
  handleChangePage, 
  handleChangeRowsPerPage, 
  handleEdit, 
  handleDeletePackage, 
  getTypeIcon, 
  fetchPackages, 
  loading, 
  error 
}) => {
  return (
    loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    ) : error ? (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'left', color: 'error.main' }}>
        <Typography>Error loading packages: {error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }} 
          onClick={() => fetchPackages()}
        >
          Retry
        </Button>
      </Paper>
    ) : (
      <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="medium" align="left">
            All Packages ({totalRecords} total)
          </Typography>
          <Button 
            startIcon={<RefreshIcon />} 
            size="small"
            onClick={() => fetchPackages()}
          >
            Refresh
          </Button>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell align="left">Package</TableCell>
                <TableCell align="left">Type</TableCell>
                <TableCell align="left">Price</TableCell>
                <TableCell align="left">Data</TableCell>
                <TableCell align="left">Validity</TableCell>
                <TableCell align="left">Region</TableCell>
                <TableCell align="left">Destination Countries</TableCell>
                <TableCell align="left">Unlimited</TableCell>
                <TableCell align="left">Actions</TableCell>
                <TableCell align="left">Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayPackages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      {totalRecords === 0 ? 'No packages found' : 'No packages match the current filters'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                // Don't slice again here since displayPackages already contains the current page data
                displayPackages.map((pkg) => (
                  <TableRow key={pkg._id} hover>
                    <TableCell align="left">
                      <Typography variant="body2" fontWeight="medium">
                        {pkg.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {pkg.destinationCountries?.join(', ').substring(0, 30)}
                        {pkg.destinationCountries?.join(', ').length > 30 ? '...' : ''}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getTypeIcon(pkg.type)}
                        <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                          {pkg.type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">${pkg.priceUSD}</TableCell>
                    <TableCell align="left">{pkg.unlimited ? 'Unlimited' : pkg.dataVolume}</TableCell>
                    <TableCell align="left">{pkg.validityDays} days</TableCell>
                    <TableCell align="left">{pkg.region}</TableCell>
                    <TableCell align="left">
                      {pkg.destinationCountries && pkg.destinationCountries.length > 0
                        ? pkg.destinationCountries.join(', ')
                        : '-'}
                    </TableCell>
                    <TableCell align="left">
                      <Typography
                        variant="body2"
                        sx={{
                          color: pkg.unlimited ? 'green' : 'red',
                          fontWeight: 'bold',
                        }}
                      >
                        {pkg.unlimited ? 'Yes' : 'No'}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(pkg)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePackage(pkg._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {pkg.topUpAvailable && (
                          <Chip
                            label="Top-up"
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        )}
                        {pkg.familyPackageAvailable && (
                          <Chip
                            label="Family"
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                        {pkg.roamingEnabled && pkg.roamingEnabled.length > 0 && (
                          <Chip
                            label={`Roaming: ${pkg.roamingEnabled.map(r => r.name).join(', ')}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        {pkg.speed && Array.isArray(pkg.speed) && pkg.speed.length > 0 && (
                          <Chip
                            label={`Speed: ${pkg.speed.join(', ')}`}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Fixed TablePagination - using totalRecords instead of displayPackages.length */}
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={totalRecords} // ✅ This is the key fix - use totalRecords instead of displayPackages.length
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

export default ViewPackagesTable;