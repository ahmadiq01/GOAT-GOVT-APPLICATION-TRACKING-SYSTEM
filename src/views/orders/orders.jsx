import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, notification, Modal, Form, Input as AntdInput, Tag, Typography, Space, Divider, Tabs, Statistic, Card } from 'antd';
import { SearchOutlined, DollarOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

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

// Method to make API calls with dynamic endpoint
const makeRequest = (endpoint, method = 'GET', data = null) => {
  const dynamicURL = `/user/${endpoint}`;  // Dynamically append the endpoint to the base URL
  
  return axiosInstance({
    url: dynamicURL,  // Use the dynamic URL here
    method: method,   // Default to GET method
    data: data,       // Send data for POST/PUT requests
  });
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });

  // Format price from cents to dollars
  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  };

  // Handle searching and filtering orders
  const handleSearch = (value) => {
    setSearchTerm(value);
    filterOrders(value, statusFilter);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    filterOrders(searchTerm, value);
  };

  const filterOrders = (search, status) => {
    let filtered = orders.filter(
      (order) =>
        (order._id.toLowerCase().includes(search.toLowerCase()) ||
          order.userId.email.toLowerCase().includes(search.toLowerCase())) &&
        (status ? (order.status === status || (status === 'active' && order.status === 'completed')) : true)
    );
    setFilteredOrders(filtered);
  };

  const handleResolveOrder = async (orderId) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to resolve the completed order
      const response = await makeRequest(`payment/orders/${orderId}/resolve`, 'PUT');
      
      if (response.data.success) {
        notification.success({
          message: 'Order Resolved',
          description: 'The order has been successfully resolved.',
          placement: 'topRight',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });
        
        // Refresh orders list
        fetchOrders(currentPage, pageSize);
      }
    } catch (error) {
      notification.error({
        message: 'Failed to Resolve Order',
        description: error.response?.data?.message || 'An error occurred while resolving the order.',
        placement: 'topRight',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalVisible(true);
  };
  // Fetch orders function
  const fetchOrders = async (page, limit) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/payment/orders?page=${page}&limit=${limit}`);
      
      if (response.data.success) {
        const { orders, pagination } = response.data.data;
        setOrders(orders);
        setFilteredOrders(orders);
        setTotalOrders(pagination.total);
        
        // Calculate summary statistics
        const active = orders.filter(o => o.status === 'active' || o.status === 'completed').length;
        const completed = orders.filter(o => o.status === 'completed').length;
        const pending = orders.filter(o => o.status === 'pending').length;
        const revenue = orders
          .filter(o => o.status === 'active' || o.status === 'completed')
          .reduce((sum, o) => sum + o.totalPriceUSD, 0);
          
        setStats({
          activeOrders: active,
          completedOrders: completed,
          pendingOrders: pending,
          totalRevenue: revenue
        });
      }
    } catch (error) {
      notification.error({
        message: 'Failed to Fetch Orders',
        description: error.response?.data?.message || 'An error occurred while fetching order data.',
        placement: 'topRight',
      });
      // Set empty data if there's an error
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    fetchOrders(pagination.current, pagination.pageSize);
  };

  // Columns for the Ant Design Table
  const columns = [
    { 
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      sorter: (a, b) => a._id.localeCompare(b._id),
      render: (id) => id.substring(id.length - 8),
    },
    { 
      title: 'Customer',
      dataIndex: ['userId', 'email'],
      key: 'email',
      sorter: (a, b) => a.userId.email.localeCompare(b.userId.email),
    },
    { 
      title: 'Package',
      dataIndex: ['packageId', 'name'],
      key: 'packageName',
      sorter: (a, b) => a.packageId.name.localeCompare(b.packageId.name),
    },
    { 
      title: 'Description',
      dataIndex: ['packageId', 'description'],
      key: 'description',
      ellipsis: true,
    },
    { 
      title: 'Validity',
      dataIndex: ['packageId', 'validityDays'],
      key: 'validity',
      render: (days) => `${days} days`,
      sorter: (a, b) => a.packageId.validityDays - b.packageId.validityDays,
    },
    { 
      title: 'Amount',
      dataIndex: 'totalPriceUSD',
      key: 'totalPriceUSD',
      sorter: (a, b) => a.totalPriceUSD - b.totalPriceUSD,
      render: (amount) => `$${formatPrice(amount)}`,
    },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      sorter: (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        let color, icon, label;
        if (status === 'active' || status === 'completed') {
          color = '#76cbba';
          icon = <CheckCircleOutlined />;
          label = 'Active';
        } else {
          color = '#faad14';
          icon = <InfoCircleOutlined />;
          label = 'Pending';
        }
        return (
          <Tag color={color} style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '14px' }}>
            <Space>
              {icon}
              <span>{label}</span>
            </Space>
          </Tag>
        );
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Pending', value: 'pending' },
      ],
      onFilter: (value, record) => value === 'active' ? (record.status === 'active' || record.status === 'completed') : record.status === value,
    },
    {
      title: 'Details',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary"
            onClick={() => handleViewOrderDetails(record)}
            style={{ backgroundColor: '#76cbba', borderColor: '#76cbba' }}
          >
            Details
          </Button>
        </Space>
      ),
      width: 220,
    },
  ];

  useEffect(() => {
    // Initial fetch of orders
    fetchOrders(currentPage, pageSize);
  }, []);

  useEffect(() => {
    filterOrders(searchTerm, statusFilter);
  }, [orders]);

  // Format the total revenue for display
  const formattedTotalRevenue = formatPrice(stats.totalRevenue);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
        <Title level={2} style={{ marginBottom: '24px', color: '#76cbba' }}>
          <DollarOutlined style={{ marginRight: '12px' }} />
          eSIM Orders Management
        </Title>
        
        <Divider style={{ marginTop: 0 }} />
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <Card style={{ flex: 1 }}>
              <Statistic 
                title="Total Revenue" 
                value={formattedTotalRevenue} 
                prefix="$" 
                precision={2}
                valueStyle={{ color: '#76cbba' }}
              />
            </Card>
            <Card style={{ flex: 1 }}>
              <Statistic 
                title="Active Orders" 
                value={stats.activeOrders} 
                suffix={` / ${totalOrders}`}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
            <Card style={{ flex: 1 }}>
              <Statistic 
                title="Completed Orders" 
                value={stats.completedOrders}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
            <Card style={{ flex: 1 }}>
              <Statistic 
                title="Pending Orders" 
                value={stats.pendingOrders}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Space size="large">
            <Input
              placeholder="Search by order ID or email"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
              prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
              allowClear
            />
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={handleStatusChange}
              style={{ width: 200 }}
              dropdownStyle={{ padding: '8px' }}
            >
              <Option value="">All Orders</Option>
              <Option value="active">
                <Space>
                  <CheckCircleOutlined style={{ color: '#76cbba' }} />
                  Active
                </Space>
              </Option>
              <Option value="pending">
                <Space>
                  <InfoCircleOutlined style={{ color: '#faad14' }} />
                  Pending
                </Space>
              </Option>
            </Select>
            <Button 
              type="default" 
              icon={<ReloadOutlined />}
              onClick={() => fetchOrders(currentPage, pageSize)}
            >
              Refresh
            </Button>
          </Space>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          pagination={{ 
            current: currentPage,
            pageSize: pageSize,
            total: totalOrders,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
            showSizeChanger: true,
            pageSizeOptions: ['25', '50', '100'],
          }}
          style={{ 
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
          bordered
          rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
          onChange={handleTableChange}
        />
      </div>

      {/* Modal for order details */}
      <Modal
        title={<div style={{ display: 'flex', alignItems: 'center' }}><InfoCircleOutlined style={{ marginRight: '8px' }} /> Order Details</div>}
        visible={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsDetailsModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
        centered
      >
        {selectedOrder && (
          <div>
            <Divider orientation="left">Order Information</Divider>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Customer Email:</strong> {selectedOrder.userId.email}</p>
            <p><strong>Package:</strong> {selectedOrder.packageId.name}</p>
            <p><strong>Description:</strong> {selectedOrder.packageId.description}</p>
            <p><strong>Validity:</strong> {selectedOrder.packageId.validityDays} days</p>
            <p><strong>Amount:</strong> ${formatPrice(selectedOrder.totalPriceUSD)}</p>
            <p><strong>Purchase Date:</strong> {new Date(selectedOrder.purchaseDate).toLocaleString()}</p>
            <p>
              <strong>Status:</strong> 
              <Tag 
                color={
                  selectedOrder.status === 'active' || selectedOrder.status === 'completed' ? '#76cbba' : '#faad14'
                } 
                style={{ margin: '0 8px', padding: '2px 8px' }}
              >
                {selectedOrder.status === 'active' || selectedOrder.status === 'completed' ? 'Active' : 'Pending'}
              </Tag>
            </p>
            {selectedOrder.status === 'active' || selectedOrder.status === 'completed' ? (
              <>
                <Divider orientation="left">eSIM Details</Divider>
                <p><strong>Activation Date:</strong> {new Date(selectedOrder.activationDate).toLocaleString()}</p>
                <p><strong>Expiration Date:</strong> {new Date(selectedOrder.expirationDate).toLocaleString()}</p>
              </>
            ) : null}
            {selectedOrder.status === 'pending' && (
              <>
                <Divider orientation="left">Pending Information</Divider>
                <p><strong>Recommended Action:</strong> Wait for payment or user action.</p>
              </>
            )}
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .table-row-light {
          background-color: #ffffff;
        }
        .table-row-dark {
          background-color: #fafafa;
        }
        .ant-table-thead > tr > th {
          background-color: #f0f5ff;
          color: #76cbba;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default OrdersManagement;