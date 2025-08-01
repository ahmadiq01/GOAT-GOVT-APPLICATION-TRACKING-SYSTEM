import React from 'react';
import { Modal, Form, Input, Select, Switch, Button } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreateAdminModal = ({ visible, loading, onCancel, onFinish }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    // Transform the form values to match API expectations
    const payload = {
      ...values,
      role: '680a29d5bee9805f0de096a6', // Default admin role ID
      isDeleted: !values.isActive, // Convert isActive to isDeleted
    };
    
    // Remove isActive from payload as we've converted it to isDeleted
    delete payload.isActive;
    
    await onFinish(payload);
    form.resetFields();
  };

  return (
    <Modal
      title={<div style={{ display: 'flex', alignItems: 'center' }}><UserOutlined style={{ marginRight: '8px' }} /> Create New Admin</div>}
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ 
          gender: 'male', 
          isGuest: false,
          isActive: true // Using isActive instead of isDeleted for better UX
        }}
      >
        <Form.Item
          name="firstname"
          label="First Name"
          rules={[{ required: true, message: 'Please enter the first name' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Enter first name" />
        </Form.Item>
        
        <Form.Item
          name="lastname"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter the last name' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Enter last name" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter the email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter the password' },
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
        </Form.Item>
        
        <Form.Item
          name="phoneno"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter the phone number' }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Enter phone number (e.g., 923356740552)" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
        >
          <Input prefix={<HomeOutlined />} placeholder="Enter address" />
        </Form.Item>
        
        <Form.Item
          name="gender"
          label="Gender"
        >
          <Select>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="isGuest"
          label="Guest User"
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Status"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
        
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button 
              onClick={() => {
                form.resetFields();
                onCancel();
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ backgroundColor: '#76cbba', borderColor: '#76cbba' }}
            >
              Create Admin
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAdminModal;