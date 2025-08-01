import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Input,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  FilterAlt as FilterIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';

const PackageActions = ({ 
  packages, 
  loading, 
  onCsvUpload, 
  allPackages, // All packages from API (unfiltered)
  isFiltered = false // Flag to indicate if current packages are filtered
}) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setUploadError('');
      } else {
        setUploadError('Please select a valid CSV file');
        setSelectedFile(null);
      }
    }
  };

  // Handle CSV upload submit
  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('csvFile', selectedFile);

      // Call the parent's upload handler (you'll implement the API call there)
      if (onCsvUpload) {
        await onCsvUpload(formData);
      }

      // Reset modal state
      setSelectedFile(null);
      setUploadModalOpen(false);
      setUploadError('');
    } catch (error) {
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle Excel download
  const handleExcelDownload = (downloadAll = false) => {
    const dataToDownload = downloadAll ? allPackages : packages;
    
    if (!dataToDownload || dataToDownload.length === 0) {
      alert('No packages available to download');
      return;
    }

    // Prepare data for Excel export
    const excelData = dataToDownload.map(pkg => ({
      'Package Name': pkg.name || '',
      'Type': pkg.type || '',
      'Price (USD)': pkg.priceUSD || '',
      'Data Volume': pkg.dataVolume || '',
      'Validity Days': pkg.validityDays || '',
      'Region': pkg.region || '',
      'Description': pkg.description || '',
      'Unlimited': pkg.unlimited ? 'Yes' : 'No',
      'Top Up Available': pkg.topUpAvailable ? 'Yes' : 'No',
      'Family Package Available': pkg.familyPackageAvailable ? 'Yes' : 'No',
      'Destination Countries': pkg.destinationCountries ? pkg.destinationCountries.join(', ') : '',
      'Speed': pkg.speed ? pkg.speed.join(', ') : '',
      'Tags': pkg.tags ? pkg.tags.join(', ') : '',
      'Roaming Enabled': pkg.roamingEnabled ? pkg.roamingEnabled.map(r => r.name).join(', ') : '',
      'Groups': pkg.groups ? pkg.groups.join(', ') : ''
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 25 }, // Package Name
      { wch: 15 }, // Type
      { wch: 12 }, // Price (USD)
      { wch: 15 }, // Data Volume
      { wch: 15 }, // Validity Days
      { wch: 20 }, // Region
      { wch: 30 }, // Description
      { wch: 12 }, // Unlimited
      { wch: 18 }, // Top Up Available
      { wch: 25 }, // Family Package Available
      { wch: 40 }, // Destination Countries
      { wch: 25 }, // Speed
      { wch: 30 }, // Tags
      { wch: 40 }, // Roaming Enabled
      { wch: 30 }  // Groups
    ];
    worksheet['!cols'] = columnWidths;

    // Style the header row
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "366092" } },
      alignment: { horizontal: "center", vertical: "center" }
    };

    // Apply header styling
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
      if (worksheet[headerCell]) {
        worksheet[headerCell].s = headerStyle;
      }
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Packages');

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const suffix = downloadAll ? 'all_packages' : (isFiltered ? 'filtered_packages' : 'packages');
    const filename = `${suffix}_report_${currentDate}.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, filename);
  };

  return (
    <>
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadIcon />}
          onClick={() => setUploadModalOpen(true)}
          disabled={loading}
        >
          Upload CSV
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={() => handleExcelDownload(true)}
          disabled={loading || !allPackages || allPackages.length === 0}
        >
          Download All ({allPackages?.length || 0})
        </Button>

        {/* Show filtered download button only when filters are applied */}
        {isFiltered && packages && packages.length > 0 && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<FilterIcon />}
            onClick={() => handleExcelDownload(false)}
            disabled={loading}
          >
            Download Filtered ({packages.length})
          </Button>
        )}
      </Box>

      {/* CSV Upload Modal */}
      <Dialog
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Upload CSV File</Typography>
            <Button
              onClick={() => setUploadModalOpen(false)}
              sx={{ minWidth: 'auto', p: 1 }}
            >
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Select a CSV file to upload package data. Make sure the file follows the correct format.
            </Typography>

            <Input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              fullWidth
              sx={{ mb: 2 }}
            />

            {selectedFile && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="primary">
                  Selected file: {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
            )}

            {uploadError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {uploadError}
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setUploadModalOpen(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUploadSubmit}
            variant="contained"
            disabled={!selectedFile || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PackageActions;