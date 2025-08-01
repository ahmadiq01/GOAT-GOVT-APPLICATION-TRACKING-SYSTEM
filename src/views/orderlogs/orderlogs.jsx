import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Input, notification, Tag, Typography, Space, Divider, Statistic, Card } from 'antd';
import { SearchOutlined, ReloadOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'https://esim.codistan.org/api', // Your base API URL
  timeout: 10000, // Optional: Set a timeout for requests
});

// Request interceptor to add headers (like authorization) dynamically based on the endpoint
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming token is stored in local storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add the token if available
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle server-side errors (e.g., 500, 404)
      console.error('Error response:', error.response);
    } else if (error.request) {
      // Handle network errors
      console.error('Error request:', error.request);
    } else {
      // Handle any other error
      console.error('Error message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

const OrderLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalLogs, setTotalLogs] = useState(0);
  const [apiWarning, setApiWarning] = useState('');

  // Safe function to get nested object properties
  const safeGet = (obj, path, defaultValue = '') => {
    try {
      return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined && current[key] !== null ? current[key] : defaultValue;
      }, obj);
    } catch (error) {
      return defaultValue;
    }
  };

  // Enhanced search function that handles missing data
  const performClientSideSearch = useCallback((data, searchValue) => {
    if (!searchValue || searchValue.trim() === '') {
      return data;
    }

    const searchLower = searchValue.toLowerCase().trim();
    
    return data.filter((log) => {
      try {
        // Safely extract searchable fields with fallbacks
        const orderId = (log.orderId || log._id || '').toString().toLowerCase();
        const userEmail = safeGet(log, 'userEmail', '').toLowerCase();
        const packageName = safeGet(log, 'packageName', '').toLowerCase();
        const action = safeGet(log, 'action', '').toLowerCase();
        const iccid = safeGet(log, 'iccid', '').toLowerCase();
        
        // Search across multiple fields
        return orderId.includes(searchLower) ||
               userEmail.includes(searchLower) ||
               packageName.includes(searchLower) ||
               action.includes(searchLower) ||
               iccid.includes(searchLower);
      } catch (error) {
        console.warn('Error during search filtering:', error);
        return false;
      }
    });
  }, []);

  // Memoized fetch function to avoid unnecessary re-renders
  const fetchLogs = useCallback(async (page = 1, limit = 25, search = '') => {
    setLoading(true);
    setApiWarning('');
    
    try {
      // For now, we'll fetch all data and handle search client-side
      // You can modify this to use server-side search if your API supports it
      let endpoint = `/payment/orders?page=${page}&limit=${limit}`;
      
      const response = await axiosInstance.get(endpoint);
      
      if (response.data.success) {
        const { orders, pagination } = response.data.data;
        const apiData = orders || [];
        
        // Check for required fields and warn if missing
        if (apiData.length > 0) {
          const missingFields = [];
          const sampleOrder = apiData[0];
          
          if (sampleOrder.stripe_fee === undefined) missingFields.push('stripe_fee');
          if (sampleOrder.actual_esim_price === undefined) missingFields.push('actual_esim_price');
          
          if (missingFields.length > 0) {
            setApiWarning(`Missing fields in API response: ${missingFields.join(', ')}. Please add them in the backend.`);
            notification.warning({
              message: 'Missing API Fields',
              description: `Fields missing: ${missingFields.join(', ')}`,
              duration: 5,
            });
          }
        }

        // Map API data to component format with safe property access
        const mappedLogs = apiData.map((log) => {
          try {
            const orderPrice = Number(log.totalPriceUSD) || 0;
            const stripeFee = Number(log.stripe_fee) || 0;
            const esimPrice = Number(log.actual_esim_price) || 0;
            const profit = orderPrice - stripeFee - esimPrice;

            return {
              _id: log._id || `temp-${Date.now()}-${Math.random()}`,
              orderId: log._id || 'N/A',
              userEmail: safeGet(log, 'userId.email', 'N/A'),
              action: log.status || 'Unknown',
              message: log.message || '',
              timestamp: log.createdAt || null,
              order_price: orderPrice,
              stripe_fee: stripeFee,
              actual_esim_price: esimPrice,
              profit: profit,
              date: log.createdAt || null,
              packageName: safeGet(log, 'packageId.name') || log.packageName || 'N/A',
              iccid: Array.isArray(log.iccid) ? log.iccid.join(', ') : (log.iccid || 'N/A'),
            };
          } catch (error) {
            console.warn('Error mapping log entry:', error, log);
            return {
              _id: log._id || `error-${Date.now()}-${Math.random()}`,
              orderId: 'Error',
              userEmail: 'Error',
              action: 'Error',
              message: 'Data mapping error',
              timestamp: null,
              order_price: 0,
              stripe_fee: 0,
              actual_esim_price: 0,
              profit: 0,
              date: null,
              packageName: 'Error',
              iccid: 'Error',
            };
          }
        });

        setLogs(mappedLogs);
        
        // Apply client-side search
        const searchResults = performClientSideSearch(mappedLogs, search);
        setFilteredLogs(searchResults);
        setTotalLogs(pagination?.total || mappedLogs.length);
        
        // Update current page from API response if available
        const apiPage = pagination?.page;
        if (apiPage && apiPage !== currentPage) {
          setCurrentPage(apiPage);
        }
      } else {
        throw new Error('API response indicates failure');
      }

    } catch (error) {
      console.error('Failed to fetch order logs:', error);
      setApiWarning('Failed to fetch from API. Please check your connection and try again.');
      
      notification.error({
        message: 'API Error',
        description: error.response?.data?.message || 'Failed to fetch order logs. Please try again.',
        duration: 5,
      });
      
      setLogs([]);
      setFilteredLogs([]);
      setTotalLogs(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, performClientSideSearch]);

  // Initial data fetch
  useEffect(() => {
    fetchLogs(1, pageSize, '');
  }, []); // Only run once on mount

  // Handle search with debouncing effect
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    
    try {
      // Perform client-side search on existing data
      const searchResults = performClientSideSearch(logs, value);
      setFilteredLogs(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      notification.error({
        message: 'Search Error',
        description: 'An error occurred while searching. Please try again.',
        duration: 3,
      });
      setFilteredLogs(logs); // Fallback to showing all logs
    }
  }, [logs, performClientSideSearch]);

  // Handle table pagination/sorting changes
  const handleTableChange = useCallback((pagination, filters, sorter) => {
    const { current, pageSize: newPageSize } = pagination;
    setCurrentPage(current);
    setPageSize(newPageSize);
    
    // If we're searching, don't refetch - just update pagination
    if (searchTerm) {
      return;
    }
    
    fetchLogs(current, newPageSize, '');
  }, [searchTerm, fetchLogs]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setSearchTerm(''); // Clear search
    fetchLogs(1, pageSize, '');
  }, [pageSize, fetchLogs]);

  // Table columns configuration
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => {
        try {
          if (!date) return 'N/A';
          return new Date(date).toLocaleDateString();
        } catch (error) {
          return 'Invalid Date';
        }
      },
      sorter: (a, b) => {
        try {
          const dateA = new Date(a.date || 0);
          const dateB = new Date(b.date || 0);
          return dateA - dateB;
        } catch (error) {
          return 0;
        }
      },
      width: 120,
    },
    {
      title: 'Order Price',
      dataIndex: 'order_price',
      key: 'order_price',
      render: (amount) => {
        try {
          return `$${(Number(amount) || 0).toFixed(2)}`;
        } catch (error) {
          return '$0.00';
        }
      },
      sorter: (a, b) => (Number(a.order_price) || 0) - (Number(b.order_price) || 0),
      width: 120,
    },
    {
      title: 'Stripe Fee',
      dataIndex: 'stripe_fee',
      key: 'stripe_fee',
      render: (amount) => {
        try {
          return `$${(Number(amount) || 0).toFixed(2)}`;
        } catch (error) {
          return '$0.00';
        }
      },
      sorter: (a, b) => (Number(a.stripe_fee) || 0) - (Number(b.stripe_fee) || 0),
      width: 120,
    },
    {
      title: 'eSIM Cost',
      dataIndex: 'actual_esim_price',
      key: 'actual_esim_price',
      render: (amount) => {
        try {
          return `$${(Number(amount) || 0).toFixed(2)}`;
        } catch (error) {
          return '$0.00';
        }
      },
      sorter: (a, b) => (Number(a.actual_esim_price) || 0) - (Number(b.actual_esim_price) || 0),
      width: 120,
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
      render: (amount) => {
        try {
          const value = Number(amount) || 0;
          const color = value >= 0 ? '#52c41a' : '#ff4d4f';
          return <span style={{ color }}>${value.toFixed(2)}</span>;
        } catch (error) {
          return <span style={{ color: '#666' }}>$0.00</span>;
        }
      },
      sorter: (a, b) => (Number(a.profit) || 0) - (Number(b.profit) || 0),
      width: 120,
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id) => {
        try {
          if (!id || id === 'N/A') return 'N/A';
          return id.toString().substring(Math.max(0, id.toString().length - 8));
        } catch (error) {
          return 'N/A';
        }
      },
      width: 120,
    },
    {
      title: 'User Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
      ellipsis: true,
      render: (email) => email || 'N/A',
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'action',
      key: 'action',
      render: (action) => {
        try {
          const status = action || 'Unknown';
          const color = status === 'completed' ? 'green' : 
                      status === 'pending' ? 'orange' : 
                      status === 'failed' ? 'red' : 'blue';
          return <Tag color={color}>{status}</Tag>;
        } catch (error) {
          return <Tag color="blue">Unknown</Tag>;
        }
      },
      width: 120,
    },
    {
      title: 'Package',
      dataIndex: 'packageName',
      key: 'packageName',
      ellipsis: true,
      render: (name) => name || 'N/A',
      width: 150,
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (date) => {
        try {
          if (!date) return 'N/A';
          return new Date(date).toLocaleString();
        } catch (error) {
          return 'Invalid Date';
        }
      },
      width: 180,
    },
  ];

  // Calculate summary statistics with error handling
  const calculateStats = (dataSet) => {
    try {
      return {
        totalOrderPrice: dataSet.reduce((sum, log) => sum + (Number(log.order_price) || 0), 0),
        totalStripeFee: dataSet.reduce((sum, log) => sum + (Number(log.stripe_fee) || 0), 0),
        totalEsimPrice: dataSet.reduce((sum, log) => sum + (Number(log.actual_esim_price) || 0), 0),
        totalProfit: dataSet.reduce((sum, log) => sum + (Number(log.profit) || 0), 0),
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalOrderPrice: 0,
        totalStripeFee: 0,
        totalEsimPrice: 0,
        totalProfit: 0,
      };
    }
  };

  const stats = calculateStats(filteredLogs);
  const displayData = searchTerm ? filteredLogs : logs;

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.09)' 
      }}>
        <Title level={2} style={{ marginBottom: '24px', color: '#76cbba' }}>
          <FileTextOutlined style={{ marginRight: '12px' }} />
          Order Logs
        </Title>
        
        <Divider style={{ marginTop: 0 }} />
        
        {/* Search and Controls */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <Space size="large">
            <Input
              placeholder="Search by order ID, email, package, or status"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 350 }}
              prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
              allowClear
            />
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
          
          {searchTerm && (
            <div style={{ color: '#666', fontSize: '14px' }}>
              Showing {filteredLogs.length} of {logs.length} orders
            </div>
          )}
        </div>

        {/* API Warning */}
        {apiWarning && (
          <div style={{ 
            marginBottom: 16, 
            padding: '8px 12px',
            backgroundColor: '#fff2e8',
            border: '1px solid #ffccc7',
            borderRadius: '4px',
            color: '#d4380d',
            fontWeight: 500
          }}>
            ⚠️ {apiWarning}
          </div>
        )}

        {/* Statistics Cards */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px' 
          }}>
            <Card>
              <Statistic 
                title={searchTerm ? "Filtered Order Value" : "Total Order Value"} 
                value={stats.totalOrderPrice} 
                prefix="$" 
                precision={2}
                valueStyle={{ color: '#76cbba' }}
              />
            </Card>
            <Card>
              <Statistic 
                title={searchTerm ? "Filtered Stripe Fees" : "Total Stripe Fees"} 
                value={stats.totalStripeFee} 
                prefix="$" 
                precision={2}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
            <Card>
              <Statistic 
                title={searchTerm ? "Filtered eSIM Cost" : "Total eSIM Cost"} 
                value={stats.totalEsimPrice} 
                prefix="$" 
                precision={2}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
            <Card>
              <Statistic 
                title={searchTerm ? "Filtered Profit" : "Total Profit"} 
                value={stats.totalProfit} 
                prefix="$" 
                precision={2}
                valueStyle={{ color: stats.totalProfit >= 0 ? '#52c41a' : '#ff4d4f' }}
              />
            </Card>
          </div>
        </div>

        {/* Data Table */}
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={displayData}
          loading={loading}
          pagination={searchTerm ? {
            // For filtered results, use simple pagination
            current: 1,
            pageSize: pageSize,
            total: filteredLogs.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} filtered orders`,
            showSizeChanger: true,
            pageSizeOptions: ['25', '50', '100'],
            onChange: (page, size) => setPageSize(size),
          } : {
            // For unfiltered results, use server pagination
            current: currentPage,
            pageSize: pageSize,
            total: totalLogs,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
            showSizeChanger: true,
            pageSizeOptions: ['25', '50', '100'],
            showQuickJumper: true,
          }}
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
          bordered
          size="small"
          scroll={{ x: 1400 }} // Enable horizontal scroll for better mobile experience
          onChange={searchTerm ? undefined : handleTableChange} // Disable server pagination when searching
        />
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .ant-table-thead > tr > th {
          background-color: #f0f5ff !important;
          color: #76cbba !important;
          font-weight: 600 !important;
        }
        .ant-table-tbody > tr:nth-child(even) {
          background-color: #fafafa !important;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #e6f7ff !important;
        }
      `}</style>
    </div>
  );
};

export default OrderLogs;