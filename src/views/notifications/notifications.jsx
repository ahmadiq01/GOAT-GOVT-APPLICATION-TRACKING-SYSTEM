import React from 'react';
import { Button, Typography, Divider } from 'antd';
import { BellOutlined, ExportOutlined } from '@ant-design/icons';

const { Title } = Typography;

const NotificationsManagement = () => {
  const handleOneSignalRedirect = () => {
    window.open('https://onesignal.com/', '_blank');
  };

  const handleBrevoRedirect = () => {
    window.open('https://www.brevo.com/', '_blank');
  };

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '32px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Header */}
        <Title level={2} style={{ 
          color: '#013F1B', 
          marginBottom: '24px',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          <BellOutlined style={{ marginRight: '12px' }} />
          Assests
        </Title>
        
        <Divider style={{ 
          margin: '0 0 32px 0', 
          borderColor: '#e8ecf0'
        }} />
        
        {/* OneSignal Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '24px',
          backgroundColor: '#fafbfc',
          borderRadius: '8px',
          border: '1px solid #e8ecf0',
          marginBottom: '24px'
        }}>
          <Title level={3} style={{ 
            color: '#2c3e50', 
            margin: 0,
            fontSize: '20px',
            fontWeight: '500'
          }}>
            1. Manage Notifications through OneSignal
          </Title>
          <Button 
            type="primary" 
            size="large"
            icon={<ExportOutlined />}
            onClick={handleOneSignalRedirect}
            style={{ 
              backgroundColor: '#3498db', 
              borderColor: '#3498db',
              height: '44px',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '6px',
              minWidth: '200px'
            }}
          >
            Go to OneSignal
          </Button>
        </div>

        <Divider style={{ 
          margin: '24px 0', 
          borderColor: '#e8ecf0'
        }} />
        
        {/* Brevo Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '24px',
          backgroundColor: '#fafbfc',
          borderRadius: '8px',
          border: '1px solid #e8ecf0'
        }}>
          <Title level={3} style={{ 
            color: '#2c3e50', 
            margin: 0,
            fontSize: '20px',
            fontWeight: '500'
          }}>
            2. Manage Notifications through Brevo
          </Title>
          <Button 
            type="primary" 
            size="large"
            icon={<ExportOutlined />}
            onClick={handleBrevoRedirect}
            style={{ 
                      backgroundColor: '#013F1B',
        borderColor: '#013F1B',
              height: '44px',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '6px',
              minWidth: '200px'
            }}
          >
            Go to Brevo
          </Button>
        </div>

        {/* App Links Section */}
        <Divider style={{ margin: '24px 0', borderColor: '#e8ecf0' }} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginBottom: '24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            backgroundColor: '#fafbfc',
            borderRadius: '8px',
            border: '1px solid #e8ecf0',
          }}>
            <Title level={3} style={{ color: '#2c3e50', margin: 0, fontSize: '20px', fontWeight: '500' }}>
              3. iOS App Link
            </Title>
            <Button
              type="primary"
              size="large"
              icon={<ExportOutlined />}
              onClick={() => window.open('https://your-ios-link.com', '_blank')}
              style={{
                backgroundColor: '#22223b',
                borderColor: '#22223b',
                height: '44px',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '6px',
                minWidth: '200px',
              }}
            >
              Open iOS App
            </Button>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            backgroundColor: '#fafbfc',
            borderRadius: '8px',
            border: '1px solid #e8ecf0',
          }}>
            <Title level={3} style={{ color: '#2c3e50', margin: 0, fontSize: '20px', fontWeight: '500' }}>
              4. Play Store App Link
            </Title>
            <Button
              type="primary"
              size="large"
              icon={<ExportOutlined />}
              onClick={() => window.open('https://your-playstore-link.com', '_blank')}
              style={{
                backgroundColor: '#388e3c',
                borderColor: '#388e3c',
                height: '44px',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '6px',
                minWidth: '200px',
              }}
            >
              Open Play Store App
            </Button>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            backgroundColor: '#fafbfc',
            borderRadius: '8px',
            border: '1px solid #e8ecf0',
          }}>
            <Title level={3} style={{ color: '#2c3e50', margin: 0, fontSize: '20px', fontWeight: '500' }}>
              5. Stripe Dashboard
            </Title>
            <Button
              type="primary"
              size="large"
              icon={<ExportOutlined />}
              onClick={() => window.open('https://dashboard.stripe.com/', '_blank')}
              style={{
                backgroundColor: '#635bff',
                borderColor: '#635bff',
                height: '44px',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '6px',
                minWidth: '200px',
              }}
            >
              Open Stripe Dashboard
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotificationsManagement;