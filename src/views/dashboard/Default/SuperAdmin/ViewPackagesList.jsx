import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  TablePagination
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Public as GlobalIcon,
  Map as RegionalIcon,
  LocationOn as LocalIcon,
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Card as AntCard } from 'antd';
import { Statistic } from 'antd';
import FilterSection from './ViewPackagesFilterSection';
// import PackageForm from './PackageForm';
import PackageTable from './ViewPackagesTable';

// Import the axiosInstance
import { axiosInstance } from '../../utils/axiosInstance'; // Adjust path as needed

// Add a static list of all countries
const allCountries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos',
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau',
  'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
  'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
  'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela',
  'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const ViewPackagesList = ({ isModalOpen, setIsModalOpen, selectedPackage, formData, setFormData, handleEdit }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filter states
  const [filters, setFilters] = useState({
    validityDays: '',
    priceUSD: '',
    region: '',
    type: '',
    unlimited: '',
    destinationCountry: '',
    dataVolume: '',
    name: ''
  });

  // For filter options - we'll fetch these separately
  const [uniqueRegions, setUniqueRegions] = useState([]);
  const [uniqueCountries, setUniqueCountries] = useState([]);

  // Statistics states
  const [statistics, setStatistics] = useState({
    totalPackages: 0,
    highestUsedPackage: 'N/A',
    highestRegion: 'N/A'
  });

  // Fetch packages from API with pagination
  const fetchPackages = async (currentPage = page, pageSize = rowsPerPage, currentFilters = filters) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage + 1, // API expects 1-based page numbering
        limit: pageSize
      });
      if (currentFilters.type === 'global') {
        params.append('country', 'Global');
        if (currentFilters.priceUSD) params.append('priceUSD', currentFilters.priceUSD);
        if (currentFilters.region) params.append('region', currentFilters.region);
        if (currentFilters.validityDays) params.append('validityDays', currentFilters.validityDays);
        if (currentFilters.unlimited !== '') params.append('unlimited', currentFilters.unlimited);
        if (currentFilters.dataVolume) params.append('dataVolume', currentFilters.dataVolume);
        if (currentFilters.name) params.append('name', currentFilters.name);
      } else if (currentFilters.type === 'region') {
        if (!currentFilters.region) {
          setLoading(false);
          setPackages([]);
          setTotalRecords(0);
          setTotalPages(0);
          return;
        }
        params.append('region', currentFilters.region);
        if (currentFilters.priceUSD) params.append('priceUSD', currentFilters.priceUSD);
        if (currentFilters.validityDays) params.append('validityDays', currentFilters.validityDays);
        if (currentFilters.unlimited !== '') params.append('unlimited', currentFilters.unlimited);
        if (currentFilters.dataVolume) params.append('dataVolume', currentFilters.dataVolume);
        if (currentFilters.name) params.append('name', currentFilters.name);
      } else if (currentFilters.type === 'country') {
        if (!currentFilters.destinationCountry) {
          setLoading(false);
          setPackages([]);
          setTotalRecords(0);
          setTotalPages(0);
          return;
        }
        params.append('country', currentFilters.destinationCountry);
        if (currentFilters.priceUSD) params.append('priceUSD', currentFilters.priceUSD);
        if (currentFilters.validityDays) params.append('validityDays', currentFilters.validityDays);
        if (currentFilters.unlimited !== '') params.append('unlimited', currentFilters.unlimited);
        if (currentFilters.dataVolume) params.append('dataVolume', currentFilters.dataVolume);
        if (currentFilters.name) params.append('name', currentFilters.name);
      } else {
        if (currentFilters.region) params.append('region', currentFilters.region);
        if (currentFilters.destinationCountry) params.append('country', currentFilters.destinationCountry);
        if (currentFilters.priceUSD) params.append('priceUSD', currentFilters.priceUSD);
        if (currentFilters.validityDays) params.append('validityDays', currentFilters.validityDays);
        if (currentFilters.unlimited !== '') params.append('unlimited', currentFilters.unlimited);
        if (currentFilters.dataVolume) params.append('dataVolume', currentFilters.dataVolume);
        if (currentFilters.name) params.append('name', currentFilters.name);
      }
      const apiUrl = `https://esim.codistan.org/api/payment/Bundlecatalogue?${params.toString()}`;
      const response = await axiosInstance.get(apiUrl);
      if (response.data && response.data.success && response.data.data && response.data.data.paginatedBundles) {
        const bundles = response.data.data.paginatedBundles;
        const pagination = response.data.data.pagination;
        setPackages(bundles);
        setTotalRecords(pagination.total || 0);
        setTotalPages(pagination.totalPages || 0);
        setError(null);
      } else {
        setPackages([]);
        setTotalRecords(0);
        setTotalPages(0);
      }
    } catch (error) {
      setPackages([]);
      setTotalRecords(0);
      setTotalPages(0);
      setError(error.message || 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options (regions and countries)
  const fetchFilterOptions = async () => {
    try {
      const response = await axiosInstance.get('https://esim.codistan.org/api/payment/Bundlecatalogue?page=1&limit=100');
      
      if (response.data && response.data.data && response.data.data.paginatedBundles) {
        const packages = response.data.data.paginatedBundles;
        
        const regions = Array.from(new Set(packages.map(pkg => pkg.region).filter(Boolean)));
        setUniqueRegions(regions);

        const countries = Array.from(new Set(packages.flatMap(pkg => pkg.destinationCountries || []))).sort();
        setUniqueCountries(countries);
      }
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      setStatistics({
        totalPackages: totalRecords,
        highestUsedPackage: 'N/A',
        highestRegion: 'N/A'
      });
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  // Initial load
  useEffect(() => {
    console.log('🎯 Initial load - fetching packages and filter options');
    fetchPackages();
    fetchFilterOptions();
  }, []);

  // Update statistics when totalRecords changes
  useEffect(() => {
    console.log('📈 Total records changed to:', totalRecords);
    fetchStatistics();
  }, [totalRecords]);

  // Handle filter changes
  useEffect(() => {
    console.log('🔍 Filters changed, resetting to page 0');
    setPage(0);
    fetchPackages(0, rowsPerPage, filters);
  }, [filters]);

  // Handle page changes
  const handleChangePage = (event, newPage) => {
    console.log('📄 Page change requested - Current page:', page, 'New page:', newPage);
    console.log('🔢 API will request page:', newPage + 1, 'with limit:', rowsPerPage);
    setPage(newPage);
    fetchPackages(newPage, rowsPerPage, filters);
  };

  // Handle rows per page changes
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log('📊 Rows per page changed to:', newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchPackages(0, newRowsPerPage, filters);
  };

  const handleAddPackage = async (packageData) => {
    try {
      setLoading(true);
      const payload = {
        ...packageData,
        priceUSD: parseFloat(packageData.priceUSD),
        validityDays: parseInt(packageData.validityDays, 10),
        destinationCountries: packageData.destinationCountries || [],
        tags: packageData.tags || []
      };
      
      await axiosInstance.post('/packages', payload);
      await fetchPackages();
      setIsModalOpen(false);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to add package');
      setLoading(false);
    }
  };

  const handleUpdatePackage = async (packageData) => {
    try {
      setLoading(true);
      const payload = {
        ...packageData,
        priceUSD: parseFloat(packageData.priceUSD),
        validityDays: parseInt(packageData.validityDays, 10),
        destinationCountries: packageData.destinationCountries || [],
        tags: packageData.tags || []
      };
      
      await axiosInstance.put(`/packages/${selectedPackage._id}`, payload);
      await fetchPackages();
      setIsModalOpen(false);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to update package');
      setLoading(false);
    }
  };

  const handleDeletePackage = async (id) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/packages/${id}`);
      await fetchPackages();
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to delete package');
      setLoading(false);
    }
  };
  
  const getTypeIcon = (type) => {
    switch(type) {
      case 'global': return <GlobalIcon sx={{ color: 'primary.main' }} fontSize="small" />;
      case 'region': return <RegionalIcon sx={{ color: 'success.main' }} fontSize="small" />;
      case 'country': return <LocalIcon sx={{ color: 'warning.main' }} fontSize="small" />;
      case 'FixedCost': return <GlobalIcon sx={{ color: 'primary.main' }} fontSize="small" />;
      default: return <GlobalIcon fontSize="small" />;
    }
  };

  
  return (
    <>
    

      {/* Cards Section */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <AntCard style={{ flex: 1 }}>
          <Statistic title="Highest Used Package" value={statistics.highestUsedPackage} valueStyle={{ color: '#013F1B' }} />
        </AntCard>
        <AntCard style={{ flex: 1 }}>
          <Statistic title="Highest Region" value={statistics.highestRegion} valueStyle={{ color: '#faad14' }} />
        </AntCard>
        <AntCard style={{ flex: 1 }}>
          <Statistic title="Total Packages" value={statistics.totalPackages} valueStyle={{ color: '#1890ff' }} />
        </AntCard>
        <AntCard style={{ flex: 1 }}>
          <Statistic title="Current Page Results" value={packages.length} valueStyle={{ color: '#52c41a' }} />
        </AntCard>
        <AntCard style={{ flex: 1 }}>
          <Statistic title="Total Pages" value={totalPages} valueStyle={{ color: '#722ed1' }} />
        </AntCard>
      </Box>
      
      {/* Inline Filter Section */}
      <FilterSection 
        filters={filters}
        setFilters={setFilters}
        uniqueRegions={uniqueRegions}
        uniqueCountries={uniqueCountries}
        allCountries={allCountries}
      />
      
      <PackageTable
        displayPackages={packages}
        packages={packages}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRecords={totalRecords}
        totalPages={totalPages}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleEdit={handleEdit}
        handleDeletePackage={handleDeletePackage}
        getTypeIcon={getTypeIcon}
        fetchPackages={fetchPackages}
        loading={loading}
        error={error}
      />
      
      {/* Package Form Modal */}
      {/* <PackageForm
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        setFormData={setFormData}
        selectedPackage={selectedPackage}
        handleAddPackage={handleAddPackage}
        handleUpdatePackage={handleUpdatePackage}
      /> */}
    </>
  );
};

export default ViewPackagesList;