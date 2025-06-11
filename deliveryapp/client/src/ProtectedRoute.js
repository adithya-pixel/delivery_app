// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext'; 

const ProtectedRoute = ({ children }) => {
  const { user } = useUser(); // Assuming `user` is null when not logged in

  if (!user) {
    return <Navigate to="/" />; // Redirect to login
  }

  return children;
};

export default ProtectedRoute;
