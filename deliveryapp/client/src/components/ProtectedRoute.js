import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // ✅ Use same as in Login.jsx

  if (!token) {
    return <Navigate to="/login" replace />; // ✅ Redirect to correct login route
  }

  return children;
};

export default ProtectedRoute;
