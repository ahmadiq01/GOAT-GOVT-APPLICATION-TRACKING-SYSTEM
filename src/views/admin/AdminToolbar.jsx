import React from 'react';
import { Input, Select, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const AdminToolbar = ({ 
  searchTerm, 
  roleFilter, 
  handleSearch, 
  handleRoleChange, 
  fetchAdmins, 
  setIsCreateModalVisible 
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <Space size="large">
        <Input
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
          allowClear
        />
        {/* <Select
          placeholder="Filter by role"
          value={roleFilter}
          onChange={handleRoleChange}
          style={{ width: 200 }}
          dropdownStyle={{ padding: '8px' }}
        >
          <Option value="">All Roles</Option>
          <Option value="680a29d5bee9805f0de096a6">Admin</Option>
          <Option value="680a29d5bee9805f0de096a1">Super Admin</Option>
        </Select> */}
        {/* <Button 
          type="default" 
          icon={<ReloadOutlined />}
          onClick={fetchAdmins}
        >
          Refresh
        </Button> */}
      </Space>
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={() => setIsCreateModalVisible(true)}
        style={{ backgroundColor: '#013F1B', borderColor: '#013F1B' }}
      >
        Create Admin
      </Button>
    </div>
  );
};

export default AdminToolbar;