import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// This component checks if the user is authenticated based on the access token
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null, to handle loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to check token validity
    const checkTokenValidity = () => {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      // Check token expiration
      const tokenExpiration = localStorage.getItem('tokenExpiration');
      const isExpired = tokenExpiration && new Date(tokenExpiration) < new Date();
      
      if (isExpired) {
        // Clear expired token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    checkTokenValidity();

    // Set up interval to periodically check token validity (every 30 seconds)
    const intervalId = setInterval(checkTokenValidity, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs only once on mount

  if (isLoading) {
    // Handle loading state while checking authentication
    return <div>Loading...</div>; // Show loading spinner or any content while checking authentication
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  return children; // If authenticated, render the protected content
};

export default ProtectedRoute;