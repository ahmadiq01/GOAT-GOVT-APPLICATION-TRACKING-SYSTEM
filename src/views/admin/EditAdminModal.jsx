import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Button, notification } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditAdminModal = ({ visible, loading, admin, onCancel, onFinish }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (admin) {
      form.setFieldsValue({
        firstname: admin.firstname || '',
        lastname: admin.lastname || '',
        email: admin.email,
        phoneno: admin.phoneno,
        address: admin.address || '',
        gender: admin.gender || 'male',
        isGuest: admin.isGuest,
        isDeleted: admin.isDeleted
      });
    }
  }, [admin, form]);

  const handleFinish = async (values) => {
    try {
      await onFinish(values);
      notification.success({
        message: 'Admin Updated Successfully',
        description: 'The admin user has been updated successfully.',
        placement: 'topRight',
      });
    } catch (error) {
      notification.error({
        message: 'Failed to Update Admin',
        description: error.response?.data?.message || 'An error occurred while updating the admin user.',
        placement: 'topRight',
      });
    }
  };

  return (
    <Modal
      title={<div style={{ display: 'flex', alignItems: 'center' }}><UserOutlined style={{ marginRight: '8px' }} /> Edit Admin</div>}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
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
          label="Password (Leave blank to keep unchanged)"
          rules={[
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
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
          name="isDeleted"
          label="Status"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
        
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ backgroundColor: '#013F1B', borderColor: '#013F1B' }}
            >
              Update Admin
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditAdminModal;