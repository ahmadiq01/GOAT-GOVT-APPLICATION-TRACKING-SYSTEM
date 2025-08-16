# Admin Panel Files Reference

This document provides a comprehensive overview of all admin and super admin files in the system, explaining their purpose and functionality.

## 🏗️ Admin Files (`src/views/dashboard/Default/Admin/`)

### 1. **AdminDashboardWrapper.jsx**
- **Purpose**: Main wrapper component for admin dashboard
- **Functionality**: Provides the layout and structure for admin users
- **Route**: `/app/admin/dashboard`
- **Description**: Central dashboard interface for administrators

### 2. **AdminApplications.jsx**
- **Purpose**: Displays all applications received by admin
- **Functionality**: Lists applications, allows filtering and basic management
- **Route**: `/app/admin/applications`
- **Description**: Main interface for viewing received applications

### 3. **ApplicationDetail.jsx**
- **Purpose**: Detailed view of individual applications
- **Functionality**: Shows comprehensive application information, allows admin actions
- **Route**: `/app/admin/application-detail`
- **Description**: In-depth application review and processing interface

### 4. **admn.jsx**
- **Purpose**: Admin main page component
- **Functionality**: Entry point for admin users
- **Route**: `/app/admin/main`
- **Description**: Landing page for admin users

## 👑 Super Admin Files (`src/views/dashboard/Default/SuperAdmin/`)

### 1. **MainDashboardWrapper.jsx**
- **Purpose**: Main wrapper for super admin dashboard
- **Functionality**: Provides layout and structure for super admin users
- **Route**: `/app/super-admin/dashboard`
- **Description**: Central dashboard interface for super administrators

### 2. **superadmin.jsx**
- **Purpose**: Super admin main page component
- **Functionality**: Entry point for super admin users
- **Route**: `/app/super-admin/main`
- **Description**: Landing page for super admin users

### 3. **ViewUserManagement.jsx**
- **Purpose**: Comprehensive user management system
- **Functionality**: Create, edit, delete, and manage all users in the system
- **Route**: `/app/super-admin/user-management`
- **Description**: Full user administration interface

### 4. **ViewNotificationCenter.jsx**
- **Purpose**: System-wide notification management
- **Functionality**: Send, manage, and monitor system notifications
- **Route**: `/app/super-admin/notifications`
- **Description**: Central notification hub for the entire system

### 5. **ApplicationManagement.jsx**
- **Purpose**: High-level application overview
- **Functionality**: Monitor and manage all applications across the system
- **Route**: `/app/super-admin/applications`
- **Description**: System-wide application monitoring

### 6. **ViewApplicationsTable.jsx**
- **Purpose**: Applications displayed in table format
- **Functionality**: Tabular view of applications with sorting and filtering
- **Route**: `/app/super-admin/applications-table`
- **Description**: Data-table view for applications

### 7. **ViewApplicationsList.jsx**
- **Purpose**: Applications displayed in list format
- **Functionality**: List view of applications with detailed information
- **Route**: `/app/super-admin/applications-list`
- **Description**: List-based view for applications

### 8. **ViewApplicationsFilterSection.jsx**
- **Purpose**: Advanced filtering and search for applications
- **Functionality**: Complex filtering, search, and data export capabilities
- **Route**: `/app/super-admin/applications-filter`
- **Description**: Advanced search and filter interface

## 🔗 Navigation Structure

### Admin Sidebar Menu Items:
- **Admin Dashboard** → Main admin interface
- **Admin Main Page** → Admin landing page
- **Received Applications** → View all applications
- **Application Detail View** → Individual application review
- **Application Processing** → Process applications
- **Feedback Management** → Manage user feedback

### Super Admin Sidebar Menu Items:
- **Super Admin Dashboard** → Main super admin interface
- **Super Admin Main Page** → Super admin landing page
- **User Management** → Manage all users
- **Application Management** → System-wide application overview
- **Applications Table View** → Table format applications
- **Applications List View** → List format applications
- **Applications Filter Section** → Advanced filtering
- **Notification Center** → System notifications

## 🎯 Key Differences

### Admin Role:
- Focuses on **application processing** and **user feedback**
- **Limited scope** - manages assigned applications
- **Operational tasks** - reviews and processes submissions

### Super Admin Role:
- **System-wide control** and **user management**
- **Administrative tasks** - manages all users and system settings
- **Full access** to all applications and system features
- **Configuration and monitoring** capabilities

## 🚀 Access Control

- **Admin users** see only admin-specific menu items
- **Super Admin users** see only super admin menu items
- **Regular users** see only user-specific menu items
- **Role-based filtering** ensures users only see relevant options

## 📱 Usage Tips

1. **Start with the main dashboard** for your role
2. **Use the sidebar navigation** to access specific features
3. **Check the route URLs** to understand the file structure
4. **Each file has a specific purpose** - use the appropriate one for your task
5. **Descriptive names** help identify functionality quickly

---

*This reference is automatically generated and updated based on the current codebase structure.*
