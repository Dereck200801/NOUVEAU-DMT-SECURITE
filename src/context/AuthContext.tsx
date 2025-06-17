import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ProfileFormData } from '../types/user';
import { toast } from 'react-toastify';
import { Role, Permission, ROLE_PERMISSIONS, AccreditationLevel } from '../auth/rbac';

/**
 * The user object stored in auth context contains additional RBAC metadata.
 */
export interface AuthUser extends User {
  role: Role;
  permissions: Permission[];
  accreditation: AccreditationLevel;
  pwd?: string; // only for local mock auth
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: ProfileFormData) => Promise<void>;
  hasPerm: (perm: Permission) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Nettoyage de la session utilisateur à chaque rafraîchissement
    localStorage.removeItem('user');

    // Seed des comptes de démo si nécessaire
    const seed = () => {
      const existing = localStorage.getItem('appUsers');
      if (existing) return;
      const demo: AuthUser[] = [
        {
          id: '1',
          name: 'admin',
          email: 'admin@dmt-securite.com',
          role: 'admin',
          permissions: [...ROLE_PERMISSIONS['admin']],
          accreditation: 'advanced',
          language: 'fr',
          notification_settings: defaultNotif(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          pwd: 'admin123',
        },
        {
          id: '2',
          name: 'supervisor',
          email: 'supervisor@dmt-securite.com',
          role: 'supervisor',
          permissions: [...ROLE_PERMISSIONS['supervisor']],
          accreditation: 'intermediate',
          language: 'fr',
          notification_settings: defaultNotif(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          pwd: 'super123',
        },
        {
          id: '3',
          name: 'agent',
          email: 'agent@dmt-securite.com',
          role: 'agent',
          permissions: [...ROLE_PERMISSIONS['agent']],
          accreditation: 'basic',
          language: 'fr',
          notification_settings: defaultNotif(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          pwd: 'agent123',
        },
      ];
      localStorage.setItem('appUsers', JSON.stringify(demo));
    };

    const defaultNotif = () => ({
      emailAlerts: true,
      missionUpdates: true,
      weeklyReports: true,
      systemAlerts: true,
      newClients: true,
    });

    seed();

    setIsLoading(false);
  }, []);

  // Sync changes made in localStorage by other services (e.g., userService)
  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === 'user' && e.newValue) {
        const newUser = JSON.parse(e.newValue);
        setUser(newUser);
      }
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Charger la base utilisateurs
    const stored = localStorage.getItem('appUsers');
    const usersList: AuthUser[] = stored ? JSON.parse(stored) : [];

    const found = usersList.find(
      (u) =>
        (u.name.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()) &&
        u.pwd === password
    );

    if (found) {
      const { pwd, ...safeUser } = found; // ne pas exposer le mot de passe au reste de l'app
      setUser(safeUser as AuthUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(safeUser));
      return true;
    }

    // Fallback : si l'utilisateur admin n'existe plus, recréons-le à la volée
    if (username.toLowerCase() === 'admin' && password === 'admin123') {
      const recreated: AuthUser = {
        id: Date.now().toString(),
        name: 'admin',
        email: 'admin@dmt-securite.com',
        role: 'admin',
        permissions: [...ROLE_PERMISSIONS['admin']],
        accreditation: 'advanced',
        language: 'fr',
        notification_settings: {
          emailAlerts: true,
          missionUpdates: true,
          weeklyReports: true,
          systemAlerts: true,
          newClients: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        pwd: 'admin123',
      } as AuthUser;

      const updated = [...usersList, recreated];
      localStorage.setItem('appUsers', JSON.stringify(updated));

      const { pwd, ...safe } = recreated;
      setUser(safe as AuthUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(safe));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateUserProfile = async (data: ProfileFormData): Promise<void> => {
    if (user) {
      const updatedUser = {
        ...user,
        ...data
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profil mis à jour avec succès');
    }
  };

  const hasPerm = (perm: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(perm);
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUserProfile,
    hasPerm,
    isLoading,
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 