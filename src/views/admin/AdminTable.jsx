import React from 'react';
import { Table, Button, Switch, Popconfirm, Tag, Avatar, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const AdminTable = ({
  filteredAdmins,
  loading,
  currentPage,
  pageSize,
  totalAdmins,
  handleTableChange,
  handleEditModalOpen,
  toggleAdminStatus,
  handleDeleteAdmin
}) => {
  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstname',
      key: 'firstname',
      width: 100, // Reduced width
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size="small" 
            src={record.profilepic} 
            icon={<UserOutlined />}
            style={{ marginRight: 8 }}
          />
          <span style={{ fontWeight: 500 }}>{text || 'N/A'}</span>
        </div>
      ),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastname',
      key: 'lastname',
      width: 100, // Reduced width
      render: (text) => <span style={{ fontWeight: 500 }}>{text || 'N/A'}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180, // Reduced width
      ellipsis: true,
      render: (email) => (
        <Tooltip title={email}>
          <span style={{ color: '#1890ff' }}>{email}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phoneno',
      key: 'phoneno',
      width: 120, // Reduced width
      render: (phone) => phone || 'N/A',
    },
    {
      title: 'Role',
      dataIndex: ['role', 'roleName'],
      key: 'role',
      width: 80, // Optimized width for better distribution
      render: (roleName) => (
        <Tag color="blue" style={{ fontWeight: 500 }}>
          {roleName || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Guest',
      dataIndex: 'isGuest',
      key: 'isGuest',
      width: 70, // Optimized width
      align: 'center',
      render: (isGuest) => (
        <Tag color={isGuest ? 'orange' : 'green'} icon={isGuest ? <UserOutlined /> : <CheckCircleOutlined />}>
          {isGuest ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isDeleted',
      key: 'status',
      width: 80, // Optimized width
      align: 'center',
      render: (isDeleted, record) => (
        <Switch
          checked={!isDeleted}
          onChange={() => toggleAdminStatus(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          style={{
            backgroundColor: isDeleted ? '#ff4d4f' : '#52c41a'
          }}
        />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100, // Optimized width
      render: (createdAt) => (
        <Tooltip title={moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}>
          <span>{moment(createdAt).format('MMM DD, YYYY')}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120, // Optimized width for action buttons
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Admin">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditModalOpen(record)}
              style={{ backgroundColor: '#1890ff' }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this admin?"
            onConfirm={() => handleDeleteAdmin(record._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Admin">
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginTop: '20px' }}>
      <Table 
        columns={columns}
        dataSource={filteredAdmins}
        loading={loading}
        rowKey="_id"
        scroll={{ x: 1000 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalAdmins,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} admins`,
          pageSizeOptions: ['25', '50', '100'],
        }}
        onChange={handleTableChange}
        rowClassName={(record, index) => 
          index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
        }
        size="middle"
        bordered
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      />
    </div>
  );
};

export default AdminTable;