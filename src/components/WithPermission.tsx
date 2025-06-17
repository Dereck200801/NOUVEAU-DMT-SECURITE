import React from 'react';
import { Permission } from '../auth/rbac';
import { useAuth } from '../context/AuthContext';

interface WithPermissionProps {
  perm: Permission;
  children: React.ReactNode;
}

/**
 * Show children only if current user owns the given permission.
 */
const WithPermission: React.FC<WithPermissionProps> = ({ perm, children }) => {
  const { hasPerm } = useAuth();
  if (!hasPerm(perm)) return null;
  return <>{children}</>;
};

export default WithPermission; 