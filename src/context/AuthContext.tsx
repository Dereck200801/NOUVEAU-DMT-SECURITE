import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ProfileFormData } from '../types/user';
import { toast } from 'react-toastify';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: ProfileFormData) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Nettoyage du localStorage au démarrage pour forcer la connexion
    localStorage.removeItem('user');
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Version simplifiée avec des identifiants en dur
    if (username === 'admin' && password === 'admin123') {
      const userData = {
        id: '1',
        name: 'Administrateur',
        email: 'admin@dmt-securite.com',
        role: 'admin',
        language: 'fr',
        notification_settings: {
          emailAlerts: true,
          missionUpdates: true,
          weeklyReports: true,
          systemAlerts: true,
          newClients: true
        }
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
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

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUserProfile,
    isLoading
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