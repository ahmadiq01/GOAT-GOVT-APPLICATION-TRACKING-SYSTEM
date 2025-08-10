import React, { useState, useEffect } from 'react';
import { Box, Button, Chip, CircularProgress, Paper, Typography } from '@mui/material';
import { Card as AntCard } from 'antd';
import { Statistic } from 'antd';
import ApplicationFilterSection from './ViewApplicationsFilterSection';
import ApplicationTable from './ViewApplicationsTable';

// Import the axiosInstance
import { axiosInstance } from 'utils/axiosInstance'; // Using absolute import

// Static list of officers
const allOfficers = [
  'Officer A. Johnson', 'Officer M. Davis', 'Officer L. Wilson', 'Officer R. Garcia',
  'Officer K. Martinez', 'Officer T. Thompson', 'Officer S. White', 'Officer P. Lee',
  'Officer J. Brown', 'Officer C. Taylor', 'Officer D. Anderson', 'Officer N. Clark'
];

// Static list of application types
const applicationTypes = [
  'Visa Application', 'Work Permit', 'Business License', 'Property Registration',
  'Tax Exemption', 'Medical License', 'Student Visa', 'Immigration Application',
  'Driving License', 'Passport Application', 'Trade License', 'Construction Permit'
];

const ViewApplicationsList = ({ isModalOpen, setIsModalOpen, selectedApplication, formData, setFormData, handleEdit }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    officerAssigned: '',
    applicationType: '',
    priority: '',
    dateFrom: '',
    dateTo: '',
    applicantName: ''
  });

  // For filter options
  const [uniqueOfficers, setUniqueOfficers] = useState([]);
  const [uniqueApplicationTypes, setUniqueApplicationTypes] = useState([]);

  // Statistics states
  const [statistics, setStatistics] = useState({
    totalApplications: 0,
    pendingReview: 0,
    completedToday: 0,
    highPriority: 0,
    avgProcessingTime: '0'
  });

  // Mock data for demonstration
  const mockApplications = [
    {
      _id: '1',
      applicantName: 'John Smith',
      description: 'Visa Application for Tourism',
      officerAssigned: 'Officer A. Johnson',
      status: 'Under Review',
      remarks: 'Initial review completed',
      submittedDate: '2024-01-15',
      attachedDocuments: ['passport.pdf', 'photo.jpg'],
      applicationType: 'Visa Application',
      priority: 'Normal',
      contactEmail: 'john.smith@email.com',
      contactPhone: '+1-555-0123'
    },
    {
      _id: '2',
      applicantName: 'Sarah Williams',
      description: 'Business License Application',
      officerAssigned: 'Officer M. Davis',
      status: 'In Progress',
      remarks: 'Awaiting additional documentation',
      submittedDate: '2024-01-14',
      attachedDocuments: ['business_plan.pdf', 'financial_statements.xlsx'],
      applicationType: 'Business License',
      priority: 'High',
      contactEmail: 'sarah.williams@email.com',
      contactPhone: '+1-555-0124'
    },
    {
      _id: '3',
      applicantName: 'Michael Brown',
      description: 'Work Permit Application',
      officerAssigned: 'Officer L. Wilson',
      status: 'Completed',
      remarks: 'Approved and processed',
      submittedDate: '2024-01-13',
      attachedDocuments: ['contract.pdf', 'qualifications.pdf', 'medical_report.pdf'],
      applicationType: 'Work Permit',
      priority: 'Normal',
      contactEmail: 'michael.brown@email.com',
      contactPhone: '+1-555-0125'
    },
    {
      _id: '4',
      applicantName: 'Emily Johnson',
      description: 'Student Visa Application',
      officerAssigned: 'Officer R. Garcia',
      status: 'Submitted',
      remarks: 'Pending initial review',
      submittedDate: '2024-01-12',
      attachedDocuments: ['admission_letter.pdf', 'transcript.pdf'],
      applicationType: 'Student Visa',
      priority: 'Low',
      contactEmail: 'emily.johnson@email.com',
      contactPhone: '+1-555-0126'
    },
    {
      _id: '5',
      applicantName: 'David Miller',
      description: 'Immigration Application',
      officerAssigned: 'Officer K. Martinez',
      status: 'Rejected',
      remarks: 'Missing required documentation',
      submittedDate: '2024-01-11',
      attachedDocuments: ['application_form.pdf'],
      applicationType: 'Immigration Application',
      priority: 'High',
      contactEmail: 'david.miller@email.com',
      contactPhone: '+1-555-0127'
    }
  ];

  // Fetch applications from API with pagination
  const fetchApplications = async (currentPage = page, pageSize = rowsPerPage, currentFilters = filters) => {
    setLoading(true);
    try {
      // For demo purposes, we'll use mock data
      // In production, this would be an actual API call
      setTimeout(() => {
        let filteredApplications = [...mockApplications];
        
        // Apply filters
        if (currentFilters.status) {
          filteredApplications = filteredApplications.filter(app => app.status === currentFilters.status);
        }
        if (currentFilters.officerAssigned) {
          filteredApplications = filteredApplications.filter(app => app.officerAssigned === currentFilters.officerAssigned);
        }
        if (currentFilters.applicationType) {
          filteredApplications = filteredApplications.filter(app => app.applicationType === currentFilters.applicationType);
        }
        if (currentFilters.priority) {
          filteredApplications = filteredApplications.filter(app => app.priority === currentFilters.priority);
        }
        if (currentFilters.applicantName) {
          filteredApplications = filteredApplications.filter(app => 
            app.applicantName.toLowerCase().includes(currentFilters.applicantName.toLowerCase())
          );
        }

        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedApplications = filteredApplications.slice(startIndex, endIndex);
        
        setApplications(paginatedApplications);
        setTotalRecords(filteredApplications.length);
        setTotalPages(Math.ceil(filteredApplications.length / pageSize));
        setError(null);
        setLoading(false);
      }, 800);

    } catch (error) {
      setApplications([]);
      setTotalRecords(0);
      setTotalPages(0);
      setError(error.message || 'Failed to fetch applications');
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      // Set static options for demo
      setUniqueOfficers(allOfficers);
      setUniqueApplicationTypes(applicationTypes);
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      setStatistics({
        totalApplications: totalRecords,
        pendingReview: Math.floor(totalRecords * 0.3),
        completedToday: Math.floor(totalRecords * 0.1),
        highPriority: Math.floor(totalRecords * 0.2),
        avgProcessingTime: '3.5 days'
      });
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  // Initial load
  useEffect(() => {
    console.log('🎯 Initial load - fetching applications and filter options');
    fetchApplications();
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
    fetchApplications(0, rowsPerPage, filters);
  }, [filters]);

  // Handle page changes
  const handleChangePage = (event, newPage) => {
    console.log('📄 Page change requested - Current page:', page, 'New page:', newPage);
    setPage(newPage);
    fetchApplications(newPage, rowsPerPage, filters);
  };

  // Handle rows per page changes
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log('📊 Rows per page changed to:', newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchApplications(0, newRowsPerPage, filters);
  };

  const handleAddApplication = async (applicationData) => {
    try {
      setLoading(true);
      // In production, this would be an API call
      // await axiosInstance.post('/applications', applicationData);
      await fetchApplications();
      setIsModalOpen(false);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to add application');
      setLoading(false);
    }
  };

  const handleUpdateApplication = async (applicationData) => {
    try {
      setLoading(true);
      // In production, this would be an API call
      // await axiosInstance.put(`/applications/${selectedApplication._id}`, applicationData);
      await fetchApplications();
      setIsModalOpen(false);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to update application');
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      setLoading(true);
      // In production, this would be an API call
      // await axiosInstance.delete(`/applications/${id}`);
      await fetchApplications();
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to delete application');
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Submitted': return '📄';
      case 'Under Review': return '👀';
      case 'In Progress': return '⏳';
      case 'Completed': return '✅';
      case 'Rejected': return '❌';
      default: return '📄';
    }
  };

  return (
    <>
      {/* Cards Section */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <AntCard style={{ flex: 1 }}>
          <Statistic title="Total Applications" value={statistics.totalApplications} valueStyle={{ color: '#1890ff' }} />
        </AntCard>
        <AntCard style={{ flex: 1 }}>
          <Statistic title="Pending Review" value={statistics.pendingReview} valueStyle={{ color: '#faad14' }} />
        </AntCard>
        <AntCard style={{ flex: 1 }}>
          <Statistic title="Completed Today" value={statistics.completedToday} valueStyle={{ color: '#52c41a' }} />
        </AntCard>
        <AntCard style={{ flex: 1 }}>
          <Statistic title="High Priority" value={statistics.highPriority} valueStyle={{ color: '#f5222d' }} />
        </AntCard>
        <AntCard style={{ flex: 1 }}>
          <Statistic title="Avg Processing Time" value={statistics.avgProcessingTime} valueStyle={{ color: '#722ed1' }} />
        </AntCard>
      </Box>
      
      {/* Filter Section */}
      <ApplicationFilterSection 
        filters={filters}
        setFilters={setFilters}
        uniqueOfficers={uniqueOfficers}
        uniqueApplicationTypes={uniqueApplicationTypes}
        allOfficers={allOfficers}
        applicationTypes={applicationTypes}
      />
      
      <ApplicationTable
        displayApplications={applications}
        applications={applications}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRecords={totalRecords}
        totalPages={totalPages}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleEdit={handleEdit}
        handleDeleteApplication={handleDeleteApplication}
        getStatusIcon={getStatusIcon}
        fetchApplications={fetchApplications}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default ViewApplicationsList;