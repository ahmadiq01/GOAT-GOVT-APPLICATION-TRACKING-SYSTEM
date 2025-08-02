import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, notification, Modal, Form, Typography, Space, Divider, Tabs, Statistic, Card, Switch, Popconfirm } from 'antd';
import { SearchOutlined, UserOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined, DeleteOutlined, LockOutlined, PlusOutlined } from '@ant-design/icons';
import { axiosInstance, makeRequest } from '../../utils/axiosInstance'; // Import your axios configuration
import AdminStatistics from './AdminStatistics';
import AdminToolbar from './AdminToolbar';
import AdminTable from './AdminTable';
import CreateAdminModal from './CreateAdminModal';
import EditAdminModal from './EditAdminModal';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const AdminUserManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAdmins: 0,
    activeAdmins: 0,
    inactiveAdmins: 0,
    guestAdmins: 0
  });

  // Handle searching and filtering admins
  const handleSearch = (value) => {
    setSearchTerm(value);
    filterAdmins(value, roleFilter);
  };

  const handleRoleChange = (value) => {
    setRoleFilter(value);
    filterAdmins(searchTerm, value);
  };

  const filterAdmins = (search, role) => {
    let filtered = admins.filter(
      (admin) => {
        const fullName = `${admin.firstname || ''} ${admin.lastname || ''}`.toLowerCase();
        const email = (admin.email || '').toLowerCase();
        const searchLower = search.toLowerCase();
        
        const nameEmailMatch = fullName.includes(searchLower) || email.includes(searchLower);
        const roleMatch = role ? admin.role?._id === role : true;
        
        return nameEmailMatch && roleMatch;
      }
    );
    setFilteredAdmins(filtered);
  };

  // Fetch admins function using the new API structure
  const fetchAdmins = async (page = currentPage, limit = pageSize) => {
    try {
      setLoading(true);
      // Using the makeRequest function with the endpoint
      const response = await makeRequest(`get/admin?page=${page}&limit=${limit}`, 'GET');
      
      if (response.data.success) {
        // FIXED: Change 'users' to 'admins' to match the API response structure
        const { admins, pagination } = response.data.data;
        setAdmins(admins);
        setFilteredAdmins(admins);
        setTotalAdmins(pagination?.total || admins.length);
        
        // Calculate summary statistics
        const activeAdmins = admins.filter(u => !u.isDeleted).length;
        const inactiveAdmins = admins.filter(u => u.isDeleted).length;
        const guestAdmins = admins.filter(u => u.isGuest).length;
          
        setStats({
          totalAdmins: admins.length,
          activeAdmins: activeAdmins,
          inactiveAdmins: inactiveAdmins,
          guestAdmins: guestAdmins
        });
      }
    } catch (error) {
      notification.error({
        message: 'Failed to Fetch Admin Users',
        description: error.response?.data?.message || 'An error occurred while fetching admin user data.',
        placement: 'topRight',
      });
      // Set empty data if there's an error
      setAdmins([]);
      setFilteredAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (values) => {
    try {
      setLoading(true);
      // Using the makeRequest function for creating admin
      const response = await makeRequest('create/admin', 'POST', values);
      
      if (response.data.success) {
        notification.success({
          message: 'Admin Created',
          description: 'The admin user has been successfully created.',
          placement: 'topRight',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });
        
        setIsCreateModalVisible(false);
        // Refresh admin users list
        fetchAdmins(currentPage, pageSize);
      }
    } catch (error) {
      notification.error({
        message: 'Failed to Create Admin',
        description: error.response?.data?.message || 'An error occurred while creating the admin user.',
        placement: 'topRight',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditAdmin = async (values) => {
    try {
      setLoading(true);
      // Using the makeRequest function for updating admin
      const response = await makeRequest(`admin/${selectedAdmin._id}`, 'UPDATE', values);
      
      if (response.data.success) {
        notification.success({
          message: 'Admin Updated',
          description: 'The admin user has been successfully updated.',
          placement: 'topRight',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });
        
        setIsEditModalVisible(false);
        setSelectedAdmin(null);
        // Refresh admin users list
        fetchAdmins(currentPage, pageSize);
      }
    } catch (error) {
      notification.error({
        message: 'Failed to Update Admin',
        description: error.response?.data?.message || 'An error occurred while updating the admin user.',
        placement: 'topRight',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      setLoading(true);
      // Using the makeRequest function for deleting admin
      const response = await makeRequest(`admin/${adminId}`, 'DELETE');
      
      if (response.data.success) {
        notification.success({
          message: 'Admin Deleted',
          description: 'The admin user has been successfully deleted.',
          placement: 'topRight',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });
        
        // Refresh admin users list
        fetchAdmins(currentPage, pageSize);
      }
    } catch (error) {
      notification.error({
        message: 'Failed to Delete Admin',
        description: error.response?.data?.message || 'An error occurred while deleting the admin user.',
        placement: 'topRight',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (admin) => {
    try {
      setLoading(true);
      
      // Determine the new status - if currently deleted (inactive), make it active
      const newStatus = !admin.isDeleted;
      
      // Using the makeRequest function for toggling admin status
      const response = await makeRequest(`/admin/${admin._id}/status`, 'PATCH', {
        isDeleted: newStatus
      });
      
      if (response.data.success) {
        const statusText = newStatus ? 'Deactivated' : 'Activated';
        const statusAction = newStatus ? 'deactivated' : 'activated';
        
        notification.success({
          message: `Admin ${statusText}`,
          description: `The admin user has been successfully ${statusAction}.`,
          placement: 'topRight',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });
        
        // Refresh admin users list
        fetchAdmins(currentPage, pageSize);
      }
    } catch (error) {
      const actionText = admin.isDeleted ? 'Activate' : 'Deactivate';
      const actionTextLower = admin.isDeleted ? 'activating' : 'deactivating';
      
      notification.error({
        message: `Failed to ${actionText} Admin`,
        description: error.response?.data?.message || `An error occurred while ${actionTextLower} the admin user.`,
        placement: 'topRight',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditModalOpen = (admin) => {
    setSelectedAdmin(admin);
    setIsEditModalVisible(true);
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    fetchAdmins(pagination.current, pagination.pageSize);
  };

  useEffect(() => {
    // Initial fetch of admin users
    fetchAdmins(currentPage, pageSize);
  }, []);

  useEffect(() => {
    filterAdmins(searchTerm, roleFilter);
  }, [admins]);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
        <Title level={2} style={{ marginBottom: '24px', color: '#013F1B' }}>
          <UserOutlined style={{ marginRight: '12px' }} />
          Admin User Management
        </Title>
        
        <Divider style={{ marginTop: 0 }} />
        
        {/* Statistics Component */}
        <AdminStatistics stats={stats} />

        {/* Toolbar Component */}
        <AdminToolbar 
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          handleSearch={handleSearch}
          handleRoleChange={handleRoleChange}
          fetchAdmins={() => fetchAdmins(currentPage, pageSize)}
          setIsCreateModalVisible={setIsCreateModalVisible}
        />

        {/* Table Component */}
        <AdminTable
          filteredAdmins={filteredAdmins}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          totalAdmins={totalAdmins}
          handleTableChange={handleTableChange}
          handleEditModalOpen={handleEditModalOpen}
          toggleAdminStatus={toggleAdminStatus}
          handleDeleteAdmin={handleDeleteAdmin}
        />
      </div>

      {/* Create Admin Modal */}
      <CreateAdminModal
        visible={isCreateModalVisible}
        loading={loading}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateAdmin}
      />

      {/* Edit Admin Modal */}
      <EditAdminModal
        visible={isEditModalVisible}
        loading={loading}
        admin={selectedAdmin}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedAdmin(null);
        }}
        onFinish={handleEditAdmin}
      />

      <style jsx global>{`
        .table-row-light {
          background-color: #ffffff;
        }
        .table-row-dark {
          background-color: #fafafa;
        }
        .ant-table-thead > tr > th {
          background-color: #f0f5ff;
          color: #013F1B;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default AdminUserManagement;