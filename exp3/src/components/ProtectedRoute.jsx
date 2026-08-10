// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, decodeToken } from '../utils/jwtHelper';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = getToken();
  
  // 1. If no token, redirect to login
  if (!token) {
    return ;
  }

  const decoded = decodeToken(token);
  const userRole = decoded?.role;

  // 2. If user role is not permitted for this route, redirect to unauthorized
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return ;
  }

  // 3. User is authorized
  return children;
};

export default ProtectedRoute;