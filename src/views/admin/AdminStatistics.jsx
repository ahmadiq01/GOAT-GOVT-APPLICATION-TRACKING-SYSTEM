import React from 'react';
import { Card, Statistic } from 'antd';

const AdminStatistics = ({ stats }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
        <Card style={{ flex: 1 }}>
          <Statistic 
            title="Total Admins" 
            value={stats.totalAdmins} 
            valueStyle={{ color: '#76cbba' }}
          />
        </Card>
        <Card style={{ flex: 1 }}>
          <Statistic 
            title="Active Admins" 
            value={stats.activeAdmins} 
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
        <Card style={{ flex: 1 }}>
          <Statistic 
            title="Inactive Admins" 
            value={stats.inactiveAdmins}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
        <Card style={{ flex: 1 }}>
          <Statistic 
            title="Guest Admins" 
            value={stats.guestAdmins}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminStatistics;