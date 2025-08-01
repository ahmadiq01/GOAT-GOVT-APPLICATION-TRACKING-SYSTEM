import React, { useRef, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/UploadFile';

export default function ActionButtons({ packages }) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  // Download packages as CSV
  const handleDownload = () => {
    if (!packages || packages.length === 0) return;
    const headers = Object.keys(packages[0]);
    const csvRows = [headers.join(',')];
    packages.forEach(pkg => {
      const row = headers.map(h => JSON.stringify(pkg[h] ?? '')); // handle commas/quotes
      csvRows.push(row.join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'packages.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Open upload modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Placeholder for upload logic
  const handleUpload = () => {
    // TODO: Integrate with upload API
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<DownloadIcon />}
        onClick={handleDownload}
        disabled={!packages || packages.length === 0}
      >
        Download CSV
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<UploadIcon />}
        onClick={handleOpen}
      >
        Upload CSV
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload CSV File</DialogTitle>
        <DialogContent>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ marginTop: 16 }}
          />
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpload} disabled={!selectedFile} variant="contained" color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 