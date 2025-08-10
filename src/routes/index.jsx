import { createBrowserRouter } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import MainRoutes from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([
  // Authentication routes first - these handle unauthenticated users
  AuthenticationRoutes,
  // Main routes for authenticated users
  MainRoutes
]);

export default router;