import React, { useState, useEffect } from 'react';
import { notification, Modal, Form, Input as AntdInput, Typography, Space, Divider, Button } from 'antd';
import { UserOutlined, MailOutlined, EditOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { makeRequest } from '../../utils/axiosInstance';
import UserTable from './UserTable';

const { Title } = Typography;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    pageSize: 25
  });
  const [filters, setFilters] = useState({
    searchTerm: '',
    statusFilter: ''
  });

  // Store all users for client-side filtering
  const [allUsers, setAllUsers] = useState([]);
  // Sorting state
  const [sortState, setSortState] = useState({ columnKey: 'name', order: 'ascend' });

  // Fetch all users from API (for dynamic search)
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      // Fetch all users with a high limit
      const response = await makeRequest(`admin/users?page=1&limit=10000`);
      
      if (response.data && response.data.data && Array.isArray(response.data.data.users)) {
        const filteredUsers = response.data.data.users.filter(
          user => user.role?.roleName !== 'Admin' && user.role?.roleName !== 'SuperAdmin'
        );
        
        setAllUsers(filteredUsers);
        // Apply initial filtering and pagination
        applyFiltersAndPagination(filteredUsers, 1, pagination.pageSize, filters.searchTerm, filters.statusFilter);
      } else {
        console.error('Invalid response format:', response);
        notification.error({
          message: 'Error',
          description: 'Failed to fetch users. Invalid data format.',
          placement: 'topRight',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch users. Please try again later.',
        placement: 'topRight',
      });
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters, sorting, and pagination to the data
  const applyFiltersAndPagination = (userData, page = 1, pageSize = 25, searchTerm = '', statusFilter = '', sort = sortState) => {
    let filteredUsers = [...userData];

    // Apply status filtering
    if (statusFilter) {
      if (statusFilter === 'active') {
        filteredUsers = filteredUsers.filter(user => !user.isDeleted);
      } else if (statusFilter === 'inactive') {
        filteredUsers = filteredUsers.filter(user => user.isDeleted);
      }
    }

    // Apply search filtering
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filteredUsers = filteredUsers.filter(user => {
        const fullName = `${user.firstname || ''} ${user.lastname || ''}`.toLowerCase();
        const email = (user.email || '').toLowerCase();
        const phone = (user.phoneno || '').toLowerCase();
        return fullName.includes(searchLower) || 
               email.includes(searchLower) || 
               phone.includes(searchLower);
      });
    }

    // Apply sorting
    if (sort && sort.columnKey && sort.order) {
      filteredUsers.sort((a, b) => {
        let valA, valB;
        switch (sort.columnKey) {
          case 'name':
            valA = `${a.firstname || ''} ${a.lastname || ''}`.toLowerCase();
            valB = `${b.firstname || ''} ${b.lastname || ''}`.toLowerCase();
            break;
          case 'email':
            valA = (a.email || '').toLowerCase();
            valB = (b.email || '').toLowerCase();
            break;
          case 'phoneno':
            valA = (a.phoneno || '').toLowerCase();
            valB = (b.phoneno || '').toLowerCase();
            break;
          case 'isDeleted':
            valA = Number(a.isDeleted);
            valB = Number(b.isDeleted);
            break;
          default:
            valA = '';
            valB = '';
        }
        if (valA < valB) return sort.order === 'ascend' ? -1 : 1;
        if (valA > valB) return sort.order === 'ascend' ? 1 : -1;
        return 0;
      });
    }

    // Calculate pagination
    const totalCount = filteredUsers.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const displayUsers = filteredUsers.slice(startIdx, endIdx);

    setUsers(displayUsers);
    setPagination(prev => ({
      ...prev,
      total: totalCount,
      page: page,
      pages: totalPages,
      pageSize: pageSize
    }));
  };

  // Fetch all users on component mount
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({ ...prev, page, pageSize }));
    applyFiltersAndPagination(allUsers, page, pageSize, filters.searchTerm, filters.statusFilter, sortState);
  };

  // Handle search - now applies filtering instantly
  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, searchTerm };
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    applyFiltersAndPagination(allUsers, 1, pagination.pageSize, searchTerm, filters.statusFilter, sortState);
  };

  // Handle status filter change - now applies filtering instantly
  const handleStatusFilterChange = (statusFilter) => {
    const newFilters = { ...filters, statusFilter };
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    applyFiltersAndPagination(allUsers, 1, pagination.pageSize, filters.searchTerm, statusFilter, sortState);
  };

  // Handle sort change
  const handleSortChange = (sorter) => {
    setSortState(sorter);
    // Always reset to first page on sort change for consistency
    setPagination(prev => ({ ...prev, page: 1 }));
    applyFiltersAndPagination(allUsers, 1, pagination.pageSize, filters.searchTerm, filters.statusFilter, sorter);
  };

  // Refresh data after operations
  const refreshData = () => {
    applyFiltersAndPagination(allUsers, pagination.page, pagination.pageSize, filters.searchTerm, filters.statusFilter, sortState);
  };

  const handleStatusToggle = async (userId, isDeleted) => {
    const newStatus = isDeleted ? false : true;
    try {
      // Call DELETE API with true/false to update user status
      await makeRequest(`admin/users/${userId}`, 'DELETE', { isDeleted: newStatus });
      
      // Update the user in allUsers array
      setAllUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, isDeleted: newStatus } : user
        )
      );
      
      // Refresh the filtered data
      refreshData();
      
      notification.success({
        message: `User Status Updated`,
        description: `User has been ${newStatus ? 'deactivated' : 'activated'} successfully.`,
        placement: 'topRight',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update user status. Please try again.',
        placement: 'topRight',
      });
      console.error('Error updating user status:', error);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      // Call API to delete the user
      await makeRequest(`admin/users/${userId}`, 'DELETE', { isDeleted: true });
      
      // Remove the user from allUsers array
      setAllUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      
      // Refresh the filtered data
      refreshData();
      
      notification.success({
        message: 'User Deleted',
        description: 'User has been permanently deleted successfully.',
        placement: 'topRight',
        icon: <DeleteOutlined style={{ color: '#76cbba' }} />,
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to delete user. Please try again.',
        placement: 'topRight',
      });
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phoneno: user.phoneno,
      address: user.address
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Call API to update user
      await makeRequest(`admin/users/${selectedUser._id}`, 'PUT', values);
      
      // Update the user in allUsers array
      setAllUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === selectedUser._id ? { ...user, ...values } : user
        )
      );
      
      // Refresh the filtered data
      refreshData();
      
      setIsModalVisible(false);
      notification.success({
        message: 'Success',
        description: 'User details updated successfully',
        placement: 'topRight',
      });
    } catch (error) {
      if (error.errorFields) {
        // Form validation errors
        return;
      }
      
      notification.error({
        message: 'Error',
        description: 'Failed to update user details. Please try again.',
        placement: 'topRight',
      });
      console.error('Error updating user:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
        <Title level={2} style={{ marginBottom: '24px', color: '#76cbba' }}>
          <UserOutlined style={{ marginRight: '12px' }} />
          App User's Management Dashboard
        </Title>
        
        <Divider style={{ marginTop: 0 }} />
        
        <UserTable 
          users={users}
          loading={loading}
          pagination={pagination}
          filters={filters}
          sortState={sortState}
          onStatusToggle={handleStatusToggle}
          onDeleteUser={handleDeleteUser}
          onUpdateUser={handleUpdateUser}
          onPaginationChange={handlePaginationChange}
          onSearch={handleSearch}
          onStatusFilterChange={handleStatusFilterChange}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Modal for updating user */}
      <Modal
        title={<div style={{ display: 'flex', alignItems: 'center' }}><EditOutlined style={{ marginRight: '8px' }} /> Update User Details</div>}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={500}
        centered
        bodyStyle={{ padding: '24px 24px 8px' }}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" style={{ backgroundColor: '#76cbba', borderColor: '#76cbba' }} type="primary" onClick={handleModalOk}>
            Save Changes
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="First Name"
            name="firstname"
            rules={[{ required: true, message: 'Please input the first name!' }]}
          >
            <AntdInput prefix={<UserOutlined style={{ color: '#76cbba' }} />} />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastname"
            rules={[{ required: true, message: 'Please input the last name!' }]}
          >
            <AntdInput prefix={<UserOutlined style={{ color: '#76cbba' }} />} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input the user email!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <AntdInput prefix={<MailOutlined style={{ color: '#76cbba' }} />} />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phoneno"
          >
            <AntdInput />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
          >
            <AntdInput />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .table-row-light {
          background-color: '#ffffff';
        }
        .table-row-dark {
          background-color: '#fafafa';
        }
        .ant-table-thead > tr > th {
          background-color: #f0fff7;
          color: #76cbba;
          font-weight: 600;
        }
        .ant-pagination .ant-pagination-item-active {
          border-color: #76cbba;
        }
        .ant-pagination .ant-pagination-item-active a {
          color: #76cbba;
        }
        .ant-pagination .ant-pagination-item:hover {
          border-color: #76cbba;
        }
        .ant-pagination .ant-pagination-item:hover a {
          color: #76cbba;
        }
        .ant-pagination .ant-pagination-prev:hover .ant-pagination-item-link,
        .ant-pagination .ant-pagination-next:hover .ant-pagination-item-link {
          color: #76cbba;
          border-color: #76cbba;
        }
        .ant-pagination .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-link-icon,
        .ant-pagination .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-link-icon {
          color: #76cbba;
        }
        .ant-select-focused .ant-select-selector {
          border-color: #76cbba !important;
        }
        .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
          background-color: #f0fff7;
          color: #76cbba;
        }
        .ant-select:hover .ant-select-selector {
          border-color: #76cbba;
        }
        .ant-select-dropdown {
          color: #76cbba;
        }
        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper-focused {
          border-color: #76cbba;
          box-shadow: 0 0 0 2px rgba(118, 203, 186, 0.2);
        }
        .ant-input-affix-wrapper:hover {
          border-color: #76cbba;
        }
        
        /* Enhanced search box text visibility */
        .ant-input-affix-wrapper input {
          color: #262626 !important;
          font-weight: 500;
        }
        .ant-input-affix-wrapper input::placeholder {
          color: #8c8c8c !important;
          font-weight: 400;
        }
        .ant-input {
          color: #262626 !important;
          font-weight: 500;
        }
        .ant-input::placeholder {
          color: #8c8c8c !important;
          font-weight: 400;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;