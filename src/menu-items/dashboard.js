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
  IconChecklist
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
  IconChecklist
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
    roles: ['SuperAdmin']
  },
  {
    id: 'user-management',
    title: 'User Management',
    type: 'item',
    url: '/app/super-admin/user-management',
    icon: icons.IconUsers,
    breadcrumbs: false,
    roles: ['SuperAdmin']
  },
  {
    id: 'application-management',
    title: 'Application Management',
    type: 'item',
    url: '/app/super-admin/applications',
    icon: icons.IconClipboardList,
    breadcrumbs: false,
    roles: ['SuperAdmin']
  },
  {
    id: 'notification-center',
    title: 'Notification Center',
    type: 'item',
    url: '/app/super-admin/notifications',
    icon: icons.IconBell,
    breadcrumbs: false,
    roles: ['SuperAdmin']
  },
  // Admin specific menu items
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard',
    type: 'item',
    url: '/app/admin/dashboard',
    icon: icons.IconDashboard,
    breadcrumbs: false,
    roles: ['Admin']
  },
  {
    id: 'received-applications',
    title: 'Received Applications',
    type: 'item',
    url: '/app/admin/applications',
    icon: icons.IconFileDescription,
    breadcrumbs: false,
    roles: ['Admin']
  },
  {
    id: 'application-processing',
    title: 'Application Processing',
    type: 'item',
    url: '/app/admin/processing',
    icon: icons.IconChecklist,
    breadcrumbs: false,
    roles: ['Admin']
  },
  {
    id: 'feedback-management',
    title: 'Feedback Management',
    type: 'item',
    url: '/app/admin/feedback',
    icon: icons.IconMessageCircle,
    breadcrumbs: false,
    roles: ['Admin']
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