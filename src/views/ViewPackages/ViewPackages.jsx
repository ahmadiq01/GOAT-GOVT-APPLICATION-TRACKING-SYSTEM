import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Tabs, Tab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import PackagesList from './ViewPackagesList';
import RefundRequests from './ViewPackagesRefundRequests';
import TopCountries from './ViewPackagesTopCountries';
import axios from 'axios'; // Import axios for API calls

export default function PackageManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
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
  const [packages, setPackages] = useState([]); // Store the fetched packages
  const [loading, setLoading] = useState(false); // To track the loading state

  // Function to fetch the packages from the new API
  const fetchPackages = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get('https://esim.codistan.org/api/payment/Bundlecatalogue');
      setPackages(response.data.data); // Assuming the API response has a 'data' field
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchPackages(); // Fetch packages when component mounts
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNewPackage = () => {
    setSelectedPackage(null);
    setFormData({
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
    setIsModalOpen(true);
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
      {/* Header */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Box sx={{ py: 3, px: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="textPrimary" align="left">
              Packages
            </Typography>
            {/* Uncomment this block if you want to add a button for adding packages */}
            {/* {activeTab === 0 && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleNewPackage}
              >
                Add Package
              </Button>
            )} */}
          </Box>
        </Box>
      </Paper>
      
      {/* Content */}
      <Box sx={{ px: 4, pb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="dashboard tabs" sx={{ '& .MuiTab-root': { textAlign: 'left' } }}>
            <Tab label="Packages" />
            <Tab label="Refund Requests" />
            <Tab label="Top Countries" />
          </Tabs>
        </Box>
        
        {activeTab === 0 ? (
          <PackagesList 
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            selectedPackage={selectedPackage}
            formData={formData}
            setFormData={setFormData}
            handleEdit={handleEdit}
            packages={packages} // Pass the fetched packages
            loading={loading} // Pass the loading state
          />
        ) : activeTab === 1 ? (
          <RefundRequests />
        ) : (
          <TopCountries />
        )}
      </Box>
    </Box>
  );
}
