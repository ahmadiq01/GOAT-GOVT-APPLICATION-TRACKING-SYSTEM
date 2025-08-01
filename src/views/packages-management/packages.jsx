import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { Add as AddIcon, Update as UpdateIcon } from '@mui/icons-material';
import PackagesList from './PackagesList';
import PackageActions from './PackageActions';
import EnhancedPackageForm from './EnhancedPackageForm'; // New enhanced form
import BulkUpdateModal from './BulkUpdateModal'; // New bulk update modal
import axios from 'axios';

export default function PackageManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, data: null });
  const [formData, setFormData] = useState({
    name: '',
    type: 'global',
    priceUSD: '',
    dataVolume: '',
    validityDays: '',
    region: '',
    description: '',
    compatibilityNote: '',
    topUpAvailable: false,
    familyPackageAvailable: false,
    destinationCountries: [],
    tags: []
  });
  const [packages, setPackages] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const fetchAllPackages = async () => {
    setLoading(true);
    try {
      const firstPageResponse = await axios.get('https://esim.codistan.org/api/payment/Bundlecatalogue?page=1&limit=100');
      const pagination = firstPageResponse.data.data.pagination;
      const totalRecords = pagination.total;
      const totalPages = pagination.totalPages;

      const allPackagesData = [];
      const batchSize = 500;
      const totalBatches = Math.ceil(totalRecords / batchSize);

      for (let page = 1; page <= totalBatches; page++) {
        try {
          const batchResponse = await axios.get(`https://esim.codistan.org/api/payment/Bundlecatalogue?page=${page}&limit=${batchSize}`);
          const batchData = batchResponse.data.data.paginatedBundles || [];

          if (batchData.length > 0) {
            allPackagesData.push(...batchData);
          } else {
            break;
          }

          if (page < totalBatches) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch {
          continue;
        }
      }

      setAllPackages(allPackagesData);
      setPackages(allPackagesData.slice(0, 25));
      setIsFiltered(false);

    } catch {
      try {
        const fallbackResponse = await axios.get('https://esim.codistan.org/api/payment/Bundlecatalogue?page=1&limit=100');
        const fallbackData = fallbackResponse.data.data.paginatedBundles || [];
        setAllPackages(fallbackData);
        setPackages(fallbackData);
        setIsFiltered(false);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (formData) => {
    try {
      alert('CSV file processed successfully! (API integration pending)');
    } catch {
      throw error;
    }
  };

  const handleFilterChange = (filteredData) => {
    setPackages(filteredData);
    setIsFiltered(filteredData.length !== allPackages.length);
  };

  const handleBulkPriceUpdate = async (updateData) => {
    const { filters, updateType, updateValue } = updateData;
    let packagesToUpdate = [];
    let hasFilters = false;

    if (filters.country || filters.region || filters.unlimited !== null || filters.fixedCost) {
      hasFilters = true;
      packagesToUpdate = allPackages.filter(pkg => {
        let matches = true;
        if (filters.country && pkg.destinationCountries && !pkg.destinationCountries.includes(filters.country)) {
          matches = false;
        }
        if (filters.region && pkg.region !== filters.region) {
          matches = false;
        }
        if (filters.unlimited !== null) {
          const isUnlimited = pkg.dataVolume && pkg.dataVolume.toLowerCase().includes('unlimited');
          if (filters.unlimited && !isUnlimited) matches = false;
          if (!filters.unlimited && isUnlimited) matches = false;
        }
        if (filters.fixedCost && pkg.priceUSD !== parseFloat(filters.fixedCost)) {
          matches = false;
        }
        return matches;
      });
    } else {
      packagesToUpdate = allPackages;
    }

    setConfirmDialog({
      open: true,
      data: {
        packages: packagesToUpdate,
        updateType,
        updateValue,
        hasFilters
      }
    });
  };

  const executeBulkUpdate = async () => {
    const { packages: packagesToUpdate, updateType, updateValue } = confirmDialog.data;
    try {
      setLoading(true);
      const updatedPackages = packagesToUpdate.map(pkg => {
        const currentPrice = parseFloat(pkg.priceUSD) || 0;
        let newPrice;
        if (updateType === 'percentage') {
          newPrice = currentPrice * (1 + updateValue / 100);
        } else {
          newPrice = currentPrice + updateValue;
        }
        return {
          ...pkg,
          priceUSD: Math.max(0, newPrice).toFixed(2)
        };
      });
 // Here you would make the API call to update packages
      // const updateResponse = await axios.put('/api/packages/bulk-update', {
      //   packages: updatedPackages,
      //   updateType,
      //   updateValue
      // });
      alert(`Successfully updated ${updatedPackages.length} packages! (API integration pending)`);
      await fetchAllPackages();
    } catch {
      alert('Error updating packages. Please try again.');
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, data: null });
    }
  };

  useEffect(() => {
    fetchAllPackages();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNewPackage = () => {
    setIsBulkUpdateOpen(true);
  };

  const handleBulkUpdate = () => {
    setIsBulkUpdateOpen(true);
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name || '',
      type: pkg.type || 'global',
      priceUSD: pkg.priceUSD || '',
      dataVolume: pkg.dataVolume || '',
      validityDays: pkg.validityDays || '',
      region: pkg.region || '',
      description: pkg.description || '',
      compatibilityNote: pkg.compatibilityNote || '',
      topUpAvailable: pkg.topUpAvailable || false,
      familyPackageAvailable: pkg.familyPackageAvailable || false,
      destinationCountries: pkg.destinationCountries || [],
      tags: pkg.tags || []
    });
    setIsModalOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Box sx={{ py: 3, px: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="textPrimary" align="left">
              Packages
            </Typography>
            {activeTab === 0 && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleNewPackage}
                >
                 Update Price By Filters
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<UpdateIcon />}
                  onClick={handleBulkUpdate}
                >
                  Bulk Update Prices
                </Button>
                <PackageActions 
                  packages={packages}
                  allPackages={allPackages}
                  loading={loading}
                  isFiltered={isFiltered}
                  onCsvUpload={handleCsvUpload}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      <Box sx={{ px: 4, pb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="dashboard tabs" sx={{ '& .MuiTab-root': { textAlign: 'left' } }}>
            <Tab label="Packages" />
          </Tabs>
        </Box>
        {activeTab === 0 && (
          <PackagesList 
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            selectedPackage={selectedPackage}
            formData={formData}
            setFormData={setFormData}
            handleEdit={handleEdit}
            packages={packages}
            loading={loading}
            onFilterChange={handleFilterChange}
          />
        )}
      </Box>

      <EnhancedPackageForm
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        setFormData={setFormData}
        selectedPackage={selectedPackage}
        handleAddPackage={null}
        handleUpdatePackage={null}
      />

      <BulkUpdateModal
        isOpen={isBulkUpdateOpen}
        onClose={() => setIsBulkUpdateOpen(false)}
        allPackages={allPackages}
        onBulkUpdate={handleBulkPriceUpdate}
      />

      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, data: null })}>
        <DialogTitle>Confirm Bulk Price Update</DialogTitle>
        <DialogContent>
          {confirmDialog.data && (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                You are about to update prices for {confirmDialog.data.packages.length} packages.
              </Alert>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Update Type:</strong> {confirmDialog.data.updateType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Update Value:</strong> {confirmDialog.data.updateType === 'percentage' ? `+${confirmDialog.data.updateValue}%` : `+$${confirmDialog.data.updateValue}`}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Scope:</strong> {confirmDialog.data.hasFilters ? 'Filtered packages only' : 'All packages'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                This action cannot be undone. Are you sure you want to proceed?
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, data: null })}>
            Cancel
          </Button>
          <Button onClick={executeBulkUpdate} variant="contained" color="primary">
            Confirm Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
