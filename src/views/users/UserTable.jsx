import React, { useCallback, useState } from 'react';
import { Table, Button, Input, Select, Tag, Space, Popconfirm } from 'antd';
import { SearchOutlined, UserOutlined, MailOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserTable = ({ 
  users = [], 
  loading = false, 
  pagination = { total: 0, page: 1, pages: 1, pageSize: 25 }, 
  filters = { searchTerm: '', statusFilter: '' },
  sortState = { columnKey: '', order: '' },
  onStatusToggle = () => {}, 
  onDeleteUser = () => {}, 
  onUpdateUser = () => {},
  onPaginationChange = () => {},
  onSearch = () => {},
  onStatusFilterChange = () => {},
  onSortChange = () => {}
}) => {
  
  // Local state to handle input value independently from filters
  const [searchValue, setSearchValue] = useState(filters.searchTerm || '');

  // Debounced search function with faster response
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 300), // Reduced from 500ms to 300ms for faster response
    [onSearch]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value); // Update local state immediately for UI responsiveness
    debouncedSearch(value); // Trigger debounced search
  };

  const handleSearchClear = () => {
    setSearchValue('');
    onSearch(''); // Clear search immediately when using clear button
  };

  const handleStatusChange = (value) => {
    onStatusFilterChange(value);
  };

  // Columns for the Ant Design Table
  const columns = [
    { 
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => {
        const nameA = `${a.firstname || ''} ${a.lastname || ''}`.toLowerCase();
        const nameB = `${b.firstname || ''} ${b.lastname || ''}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
      sortOrder: sortState.columnKey === 'name' ? sortState.order : null,
      render: (_, record) => (
        <Space>
          <UserOutlined style={{ color: '#013F1B' }} />
          <span>{`${record.firstname || ''} ${record.lastname || ''}`}</span>
        </Space>
      ),
    },
    { 
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
      sortOrder: sortState.columnKey === 'email' ? sortState.order : null,
      render: (text) => (
        <Space>
          <MailOutlined style={{ color: '#013F1B' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phoneno',
      key: 'phoneno',
      sorter: (a, b) => (a.phoneno || '').localeCompare(b.phoneno || ''),
      sortOrder: sortState.columnKey === 'phoneno' ? sortState.order : null,
      render: (text) => text || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      sorter: (a, b) => Number(a.isDeleted) - Number(b.isDeleted),
      sortOrder: sortState.columnKey === 'isDeleted' ? sortState.order : null,
      render: (isDeleted) => (
        <Tag color={!isDeleted ? '#013F1B' : '#ff4d4f'} style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '14px' }}>
          {!isDeleted ? (
            <Space>
              <CheckCircleOutlined />
              <span>Active</span>
            </Space>
          ) : (
            <Space>
              <CloseCircleOutlined />
              <span>Inactive</span>
            </Space>
          )}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type={!record.isDeleted ? 'default' : 'primary'} 
            danger={!record.isDeleted}
            onClick={() => onStatusToggle(record._id, record.isDeleted)}
            style={{ 
              backgroundColor: !record.isDeleted ? '#fff' : '#013F1B',
              borderColor: !record.isDeleted ? '#ff4d4f' : '#52c41a',
              color: !record.isDeleted ? '#ff4d4f' : '#fff',
              minWidth: '90px',
              fontSize: '12px'
            }}
            size="small"
          >
            {!record.isDeleted ? 'Deactivate' : 'Activate'}
          </Button>
          <Button 
            icon={<EditOutlined />} 
            type="primary" 
            onClick={() => onUpdateUser(record)}
            style={{ backgroundColor: '#013F1B', borderColor: '#013F1B', minWidth: '70px' }}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to permanently delete this user?"
            onConfirm={() => onDeleteUser(record._id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger
              style={{ minWidth: '70px' }}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 280,
      sorter: false,
    },
  ];

  return (
    <>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-start', // Changed from space-between to flex-start
        alignItems: 'center', 
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <Space size="large" style={{ flexWrap: 'wrap' }}>
          <Input
            placeholder="Search users by name, email or phone"
            value={searchValue}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            style={{ 
              width: 300, 
              minWidth: 250,
              fontSize: '14px',
              fontWeight: '500'
            }}
            prefix={<SearchOutlined style={{ color: '#013F1B' }} />}
            allowClear
          />
          <Select
            placeholder="Filter by status"
            value={filters?.statusFilter || ''}
            onChange={handleStatusChange}
            style={{ width: 200, minWidth: 150 }}
            dropdownStyle={{ padding: '8px' }}
          >
            <Option value="">All Users</Option>
            <Option value="active">
              <Space>
                <CheckCircleOutlined style={{ color: '#013F1B' }} />
                Active Users
              </Space>
            </Option>
            <Option value="inactive">
              <Space>
                <CloseCircleOutlined style={{ color: '#ff1744' }} />
                Inactive Users
              </Space>
            </Option>
          </Select>
        </Space>
        
        {/* Removed the Total users display section */}
      </div>
      
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{ 
          current: pagination?.page || 1,
          pageSize: pagination?.pageSize || 25,
          total: pagination?.total || 0,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
          showSizeChanger: true,
          pageSizeOptions: ['25', '50', '100'],
          showQuickJumper: true,
          onChange: onPaginationChange,
          onShowSizeChange: onPaginationChange,
          style: { marginTop: '16px' }
        }}
        style={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
        bordered
        scroll={{ x: 1000 }} // Enable horizontal scrolling on small screens
        rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
        size="middle"
        onChange={(pagination, filters, sorter) => {
          if (sorter && sorter.columnKey) {
            onSortChange({ columnKey: sorter.columnKey, order: sorter.order });
          }
        }}
      />
    </>
  );
};

// Simple debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default UserTable;