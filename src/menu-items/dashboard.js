// assets
import { 
  IconDashboard, 
  IconUsers, 
  IconPackage, 
  IconShoppingCart, 
  IconBell, 
  IconFileText, 
  IconAsset
} from '@tabler/icons-react';

// constant
const icons = { 
  IconDashboard,
  IconUsers,
  IconPackage,
  IconShoppingCart,
  IconBell,
  IconFileText,
  IconAsset
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
  {
    id: 'default',
    title: 'Dashboard',
    type: 'item',
    url: '/dashboard',
    icon: icons.IconDashboard,
    breadcrumbs: false,
    roles: ['Admin', 'SuperAdmin', 'User'] // All roles can access dashboard
  },
  
  {
    id: 'packages',
    title: 'View Packages',
    type: 'item',
    url: '/ViewPackages',
    icon: icons.IconPackage,
    breadcrumbs: false,
    roles: ['Admin', 'SuperAdmin'] // Both roles can manage packages
  },
  {
    id: 'admin',
    title: 'Admin Users',
    type: 'item',
    url: '/user',
    icon: icons.IconUsers,
    breadcrumbs: false,
    roles: ["Admin",'SuperAdmin'] // Only SuperAdmin can manage admin users
  },
  {
    id: 'my-applications',
    title: 'My Applications',
    type: 'item',
    url: '/my-applications',
    icon: icons.IconFileText,
    breadcrumbs: false,
    roles: ['User'] // Only users can see their own applications
  },
  {
    id: 'my-orders',
    title: 'My Orders',
    type: 'item',
    url: '/my-orders',
    icon: icons.IconShoppingCart,
    breadcrumbs: false,
    roles: ['User'] // Only users can see their own orders
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