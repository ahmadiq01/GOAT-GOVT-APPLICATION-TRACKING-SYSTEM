import React, { useState } from 'react';
import { Button, Typography, Divider, Spin, Alert, Modal, Select } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const EsimPriceScrapper = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedProviders, setSelectedProviders] = useState([]);

  const providerOptions = [
    { label: 'Airalo', value: 'airalo' },
    { label: 'GetNomad', value: 'getnomad' },
    { label: 'Saily', value: 'saily' },
    { label: 'Jetpack', value: 'jetpack' },
    { label: 'Monty', value: 'monty' },
    { label: 'YesIM', value: 'yesim' }
  ];

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      let requestBody;
      
      if (selectedProviders.length === 0) {
        // No providers selected - use default body
        requestBody = { "verbose": false };
      } else {
        // Providers selected - include them in the body
        requestBody = { 
          "verbose": false, 
          "websites": selectedProviders 
        };
      }

      const response = await fetch('https://esim.codistan.org/python/airalo/get_packages', {
        method: 'POST',
        headers: {
          'Accept': 'text/csv',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'esim_packages.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      setData('Download successful!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (value) => {
    setSelectedProviders(value);
  };

  let content = null;
  if (error) {
    content = <Alert type="error" message={error} />;
  } else if (data) {
    content = <Alert type="success" message={data} showIcon style={{ marginTop: 24 }} />;
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Modal open={loading} footer={null} closable={false} centered>
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin tip="Loading..." size="large" />
          <div style={{ marginTop: 16, fontWeight: 500, fontSize: 16 }}>
            Wait a while as it takes upto 15 minutes to download
          </div>
        </div>
      </Modal>
      
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxWidth: '900px', margin: '0 auto' }}>
        <Title level={2} style={{ color: '#76cbba', marginBottom: '24px', fontSize: '28px', fontWeight: '600' }}>
          <DownloadOutlined style={{ marginRight: '12px' }} />
          eSIM Price Scraper
        </Title>
        
        <Divider style={{ margin: '0 0 32px 0', borderColor: '#e8ecf0' }} />
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '500', color: '#333' }}>
            Select eSIM Providers (optional):
          </label>
          <Select
            mode="multiple"
            placeholder="Select providers or leave empty for all"
            value={selectedProviders}
            onChange={handleProviderChange}
            options={providerOptions}
            style={{ width: '100%', minHeight: '40px' }}
            size="large"
            allowClear
          />
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
            Leave empty to scrape all available providers
          </div>
        </div>
        
        <Button
          type="primary"
          size="large"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          disabled={loading}
          style={{ 
            backgroundColor: '#3498db', 
            borderColor: '#3498db', 
            height: '44px', 
            fontSize: '16px', 
            fontWeight: '500', 
            borderRadius: '6px', 
            minWidth: '220px' 
          }}
        >
          Download eSIM Packages
        </Button>
        
        {selectedProviders.length > 0 && (
          <div style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
            Selected providers: {selectedProviders.join(', ')}
          </div>
        )}
        
        {content}
      </div>
    </div>
  );
};

export default EsimPriceScrapper;