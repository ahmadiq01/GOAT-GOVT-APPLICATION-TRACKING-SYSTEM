import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import RegisterUser from 'views/auth-forms/register-user/register-user';

// maintenance routing
const LoginPage = Loadable(lazy(() => import('views/authentication/Login')));
const RegisterPage = Loadable(lazy(() => import('views/authentication/Register')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //
const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <RegisterUser /> // Make register-user the default route
    },
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/register',
      element: <RegisterPage />
    },
    {
      path: '/register-user',
      element: <RegisterUser />
    }
  ]
};

export default AuthenticationRoutes;