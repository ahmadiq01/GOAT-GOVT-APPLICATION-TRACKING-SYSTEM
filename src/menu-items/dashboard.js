// assets
import { 
  IconDashboard, 
  IconUsers, 
  IconPackage, 
  IconShoppingCart, 
  IconBell, 
  IconFileText, 
  IconAsset,
  IconSettings,
  IconClipboardList,
  IconFileDescription,
  IconMessageCircle,
  IconChecklist,
  IconTable,
  IconFilter,
  IconHome,
  IconUserCheck,
  IconFileAnalytics,
  IconClipboardCheck
} from '@tabler/icons-react';

// constant
const icons = { 
  IconDashboard,
  IconUsers,
  IconPackage,
  IconShoppingCart,
  IconBell,
  IconFileText,
  IconAsset,
  IconSettings,
  IconClipboardList,
  IconFileDescription,
  IconMessageCircle,
  IconChecklist,
  IconTable,
  IconFilter,
  IconHome,
  IconUserCheck,
  IconFileAnalytics,
  IconClipboardCheck
};

// Function to get user role from localStorage
const getUserRole = () => {
  try {
    // userRole is stored as a string (e.g., "superadmin" or "admin")
    const userRole = localStorage.getItem('userRole');
    return userRole ? userRole.toLowerCase() : null;
  } catch (error) {
    console.error('Error reading user role:', error);
    return null;
  }
};

// Function to get user data from localStorage
const getUserData = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Define menu items with role permissions
const menuItems = [
  // Super Admin specific menu items
  {
    id: 'super-admin-dashboard',
    title: 'Super Admin Dashboard',
    type: 'item',
    url: '/app/super-admin/dashboard',
    icon: icons.IconDashboard,
    breadcrumbs: false,
    roles: ['SuperAdmin'],
    description: 'Main dashboard for super administrators'
  },
  {
    id: 'super-admin-main',
    title: 'Super Admin Main Page',
    type: 'item',
    url: '/app/super-admin/main',
    icon: icons.IconHome,
    breadcrumbs: false,
    roles: ['SuperAdmin'],
    description: 'Main super admin interface'
  },
  {
    id: 'user-management',
    title: 'User Management',
    type: 'item',
    url: '/app/super-admin/user-management',
    icon: icons.IconUsers,
    breadcrumbs: false,
    roles: ['SuperAdmin'],
    description: 'Manage all users in the system'
  },
  {
    id: 'application-management',
    title: 'Application Management',
    type: 'item',
    url: '/app/super-admin/applications',
    icon: icons.IconClipboardList,
    breadcrumbs: false,
    roles: ['SuperAdmin'],
    description: 'Overview of all applications'
  },
  {
    id: 'applications-table',
    title: 'Applications Table View',
    type: 'item',
    url: '/app/super-admin/applications-table',
    icon: icons.IconTable,
    breadcrumbs: false,
    roles: ['SuperAdmin'],
    description: 'View applications in table format'
  },
  {
    id: 'applications-list',
    title: 'Applications List View',
    type: 'item',
    url: '/app/super-admin/applications-list',
    icon: icons.IconClipboardList,
    breadcrumbs: false,
    roles: ['SuperAdmin'],
    description: 'View applications in list format'
  },
  {
    id: 'applications-filter',
    title: 'Applications Filter Section',
    type: 'item',
    url: '/app/super-admin/applications-filter',
    icon: icons.IconFilter,
    breadcrumbs: false,
    roles: ['SuperAdmin'],
    description: 'Filter and search applications'
  },
  {
    id: 'notification-center',
    title: 'Notification Center',
    type: 'item',
    url: '/app/super-admin/notifications',
    icon: icons.IconBell,
    breadcrumbs: false,
    roles: ['SuperAdmin'],
    description: 'Manage system notifications'
  },
  
  // Admin specific menu items
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    type: 'item',
    url: '/app/admin/dashboard',
    icon: icons.IconDashboard,
    breadcrumbs: false,
    roles: ['Admin'],
    description: 'Main dashboard for administrators'
  },
  {
    id: 'admin-main',
    title: 'Admin Main Page',
    type: 'item',
    url: '/app/admin/main',
    icon: icons.IconHome,
    breadcrumbs: false,
    roles: ['Admin'],
    description: 'Main admin interface'
  },
  {
    id: 'received-applications',
    title: 'Received Applications',
    type: 'item',
    url: '/app/admin/applications',
    icon: icons.IconFileDescription,
    breadcrumbs: false,
    roles: ['Admin'],
    description: 'View all received applications'
  },
  {
    id: 'application-detail',
    title: 'Application Detail View',
    type: 'item',
    url: '/app/admin/application-detail',
    icon: icons.IconFileAnalytics,
    breadcrumbs: false,
    roles: ['Admin'],
    description: 'Detailed view of individual applications'
  },
  {
    id: 'application-processing',
    title: 'Application Processing',
    type: 'item',
    url: '/app/admin/processing',
    icon: icons.IconChecklist,
    breadcrumbs: false,
    roles: ['Admin'],
    description: 'Process and review applications'
  },
  {
    id: 'feedback-management',
    title: 'Feedback Management',
    type: 'item',
    url: '/app/admin/feedback',
    icon: icons.IconMessageCircle,
    breadcrumbs: false,
    roles: ['Admin'],
    description: 'Manage user feedback and responses'
  },
  
  // User routes
  {
    id: 'user-dashboard',
    title: 'My Dashboard',
    type: 'item',
    url: '/app/user-dashboard',
    icon: icons.IconDashboard,
    breadcrumbs: false,
    roles: ['user'],
    description: 'Personal user dashboard'
  },
  {
    id: 'application-details',
    title: 'My Application Details',
    type: 'item',
    url: '/app/ApplicationDetails',
    icon: icons.IconFileDescription,
    breadcrumbs: false,
    roles: ['user'],
    description: 'View your application details'
  },
  {
    id: 'feedback-submission',
    title: 'Submit Feedback',
    type: 'item',
    url: '/app/feedback',
    icon: icons.IconMessageCircle,
    breadcrumbs: false,
    roles: ['user'],
    description: 'Submit feedback or questions'
  }
];

// Function to filter menu items based on user role
const getFilteredMenuItems = () => {
  const userRole = getUserRole();
  const userData = getUserData();

  if (!userRole || !userData) {
    return []; // Return empty array if no role found
  }

  // Filter menu items based on user role (case-insensitive)
  const filteredItems = menuItems.filter(item =>
    item.roles.map(r => r.toLowerCase()).includes(userRole)
  );

  return filteredItems;
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const getDashboard = () => {
  const filteredMenuItems = getFilteredMenuItems();
  
  return {
    id: 'dashboard',
    title: 'Admin Portal',
    type: 'group',
    children: filteredMenuItems
  };
};

// Create the dashboard object
const dashboard = getDashboard();

// Export both the static object (for backward compatibility) and the function
export default dashboard;
export { getDashboard, getUserRole, getUserData };