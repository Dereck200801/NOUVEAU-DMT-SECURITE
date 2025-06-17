import React from 'react';
import { Navigate } from 'react-router-dom';
import { Permission } from '../auth/rbac';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  perm: Permission;
  children: JSX.Element;
}

/**
 * Protect complete routes by a specific permission.
 * If the user lacks the permission, redirect to the /403 page (to create) or /login.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ perm, children }) => {
  const { isAuthenticated, hasPerm } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPerm(perm)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute; 