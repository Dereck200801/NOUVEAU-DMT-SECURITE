import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faBell, 
  faLock, 
  faBuilding, 
  faSave,
  faPalette,
  faUserShield,
  faKey,
  faTrash,
  faUsers,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userService } from '../services/userService';
import { companyService } from '../services/companyService';
import { ProfileFormData, NotificationSettings, PasswordFormData } from '../types/user';
import { CompanyFormData } from '../types/company';
import { AuthUser } from '../context/AuthContext';
import { Role, AccreditationLevel, ROLE_PERMISSIONS } from '../auth/rbac';
import { Permission } from '../auth/rbac';
import { ThemeContext, Theme } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const { user, updateUserProfile, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile form state
  interface ExtendedProfileFormData extends ProfileFormData {
    phone: string;
    role: string;
  }

  const defaultNotificationSettings: NotificationSettings = {
    emailAlerts: true,
    missionUpdates: true,
    weeklyReports: true,
    systemAlerts: false,
    newClients: true
  };

  const [profileForm, setProfileForm] = useState<ExtendedProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: (user as any)?.phone || '',
    role: (user as any)?.role || '',
    language: user?.language || 'fr',
    notification_settings: user?.notification_settings || defaultNotificationSettings
  });

  // Update profile form when user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        role: (user as any).role || '',
        language: user.language || 'fr',
        notification_settings: user.notification_settings || defaultNotificationSettings
      });
    }
  }, [user]);
  
  // Company form state
  const [companyForm, setCompanyForm] = useState<CompanyFormData>({
    companyName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    taxId: ''
  });

  // Load company data
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const companyData = await companyService.getCompanyInfo();
        setCompanyForm(companyData as any);
      } catch (error) {
        console.error('Error loading company data:', error);
      }
    };
    loadCompanyData();
  }, []);
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailAlerts: true,
    missionUpdates: true,
    weeklyReports: true,
    systemAlerts: false,
    newClients: true
  });

  // Load notification settings
  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const response = await userService.getProfile();
        if (response.notification_settings) {
          setNotificationSettings(response.notification_settings);
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    };
    loadNotificationSettings();
  }, []);
  
  // Security settings state
  const [securityForm, setSecurityForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Preferences (Interface) state
  const [preferencesForm, setPreferencesForm] = useState({
    theme: 'light', // 'light' | 'dark' | 'system'
    density: 'comfortable' // 'comfortable' | 'compact'
  });

  // Theme context
  const { setTheme: applyTheme } = useContext(ThemeContext);

  // 2-Factor Authentication state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Integrations – dummy API keys list
  const [apiKeys, setApiKeys] = useState<{ id: string; key: string }[]>([]);

  /**
   * Gestion des utilisateurs (uniquement admin).
   * Les utilisateurs sont stockés dans localStorage sous la clé "appUsers".
   */
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'agent' as Role,
    accreditation: 'basic' as AccreditationLevel,
    password: '',
    permissions: [...ROLE_PERMISSIONS['agent']] as Permission[],
  });

  // Load users list on mount
  useEffect(() => {
    const stored = localStorage.getItem('appUsers');
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      // Seed with current user if admin
      if (user && user.role === 'admin') {
        localStorage.setItem('appUsers', JSON.stringify([user]));
        setUsers([user]);
      }
    }
  }, []);

  const persistUsers = (list: AuthUser[]) => {
    setUsers(list);
    localStorage.setItem('appUsers', JSON.stringify(list));
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) return;
    const created: AuthUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      accreditation: newUser.accreditation,
      permissions: newUser.permissions,
      language: 'fr',
      notification_settings: defaultNotificationSettings,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pwd: newUser.password,
    } as AuthUser;
    const updated = [...users, created];
    persistUsers(updated);
    setNewUser({ name: '', email: '', role: 'agent', accreditation: 'basic', password: '', permissions: [...ROLE_PERMISSIONS['agent']] });
    toast.success('Utilisateur ajouté');
  };

  const handleDeleteUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    persistUsers(updated);
    toast.success('Utilisateur supprimé');
  };

  // Load preferences, 2FA and API keys (placeholders for real API calls)
  useEffect(() => {
    // TODO: Replace with real calls
    const storedTheme = localStorage.getItem('theme');
    const storedDensity = localStorage.getItem('density');
    if (storedTheme || storedDensity) {
      setPreferencesForm({
        theme: (storedTheme as 'light' | 'dark' | 'system') || 'light',
        density: (storedDensity as 'comfortable' | 'compact') || 'comfortable'
      });
    }

    const stored2FA = localStorage.getItem('is2FAEnabled');
    if (stored2FA) setIs2FAEnabled(stored2FA === 'true');

    const storedKeys = localStorage.getItem('apiKeys');
    if (storedKeys) setApiKeys(JSON.parse(storedKeys));
  }, []);

  // Handlers for preferences
  const handlePreferencesChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPreferencesForm(prev => ({ ...prev, [name]: value }));

    // Apply theme immediately when selecting a different theme option
    if (name === 'theme') {
      applyTheme(value as Theme);
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Send to backend
      localStorage.setItem('theme', preferencesForm.theme);
      localStorage.setItem('density', preferencesForm.density);

      // Apply theme after saving preferences
      applyTheme(preferencesForm.theme as Theme);
      toast.success('Préférences mises à jour');
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler 2FA toggle
  const handle2FAToggle = async () => {
    setIsLoading(true);
    try {
      const newState = !is2FAEnabled;
      // TODO: API call to enable/disable 2FA
      setIs2FAEnabled(newState);
      localStorage.setItem('is2FAEnabled', String(newState));
      toast.success('Paramètre 2FA mis à jour');
    } catch (error) {
      console.error('Error toggling 2FA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Integration handlers (dummy)
  const handleGenerateApiKey = () => {
    const newKey = Math.random().toString(36).substring(2, 15);
    const newApiKey = { id: Date.now().toString(), key: newKey };
    const updated = [...apiKeys, newApiKey];
    setApiKeys(updated);
    localStorage.setItem('apiKeys', JSON.stringify(updated));
    toast.success('Nouvelle clé API générée');
  };

  const handleRevokeKey = (id: string) => {
    const updated = apiKeys.filter(k => k.id !== id);
    setApiKeys(updated);
    localStorage.setItem('apiKeys', JSON.stringify(updated));
    toast.info('Clé API révoquée');
  };

  // Privacy handlers (dummy)
  const handleExportData = () => {
    toast.info('Exportation des données lancée (fonctionnalité en développement)');
  };

  const handleDeleteAccount = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement votre compte ?')) {
      toast.error('Suppression du compte lancée (fonctionnalité en développement)');
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateUserProfile(profileForm as any);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle company form submission
  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await companyService.updateCompanyInfo(companyForm);
      toast.success('Informations de l\'entreprise mises à jour avec succès');
    } catch (error) {
      console.error('Error updating company info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle notification settings update
  const handleNotificationToggle = async (setting: keyof NotificationSettings) => {
    setIsLoading(true);
    try {
      const newSettings = {
        ...notificationSettings,
        [setting]: !notificationSettings[setting]
      };
      await userService.updateNotificationSettings(newSettings);
      setNotificationSettings(newSettings);
      toast.success('Paramètres de notification mis à jour');
    } catch (error) {
      console.error('Error updating notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
      toast.error('Veuillez remplir tous les champs du mot de passe');
      return;
    }
    
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    
    if (securityForm.newPassword.length < 8) {
      toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    setIsLoading(true);
    try {
      await userService.changePassword(securityForm.currentPassword, securityForm.newPassword);
      toast.success('Mot de passe mis à jour avec succès');
      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle company form change
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle security form change
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isAuthLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent"></div>
    </div>;
  }

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileSubmit}>
            <h2 className="text-base font-semibold mb-4">Informations du profil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <input
                  type="text"
                  name="role"
                  value={profileForm.role}
                  onChange={handleProfileChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                <select
                  name="language"
                  value={profileForm.language}
                  onChange={handleProfileChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                type="submit" 
                className={`bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        );
        
      case 'company':
        return (
          <form onSubmit={handleCompanySubmit}>
            <h2 className="text-base font-semibold mb-4">Informations de l'entreprise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
                <input
                  type="text"
                  name="companyName"
                  value={companyForm.companyName}
                  onChange={handleCompanyChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={companyForm.email}
                  onChange={handleCompanyChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={companyForm.phone}
                  onChange={handleCompanyChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                <input
                  type="text"
                  name="website"
                  value={companyForm.website}
                  onChange={handleCompanyChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <textarea
                  name="address"
                  value={companyForm.address}
                  onChange={handleCompanyChange}
                  rows={3}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant fiscal</label>
                <input
                  type="text"
                  name="taxId"
                  value={companyForm.taxId}
                  onChange={handleCompanyChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                type="submit" 
                className={`bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        );
        
      case 'notifications':
        return (
          <div>
            <h2 className="text-base font-semibold mb-4">Paramètres de notification</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium">Alertes par email</h3>
                  <p className="text-sm text-gray-500">Recevoir des alertes importantes par email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notificationSettings.emailAlerts}
                    onChange={() => handleNotificationToggle('emailAlerts')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium">Mises à jour des missions</h3>
                  <p className="text-sm text-gray-500">Notifications sur les changements de missions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notificationSettings.missionUpdates}
                    onChange={() => handleNotificationToggle('missionUpdates')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium">Rapports hebdomadaires</h3>
                  <p className="text-sm text-gray-500">Recevoir un résumé hebdomadaire des activités</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notificationSettings.weeklyReports}
                    onChange={() => handleNotificationToggle('weeklyReports')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium">Alertes système</h3>
                  <p className="text-sm text-gray-500">Notifications techniques et de maintenance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notificationSettings.systemAlerts}
                    onChange={() => handleNotificationToggle('systemAlerts')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium">Nouveaux clients</h3>
                  <p className="text-sm text-gray-500">Notifications à l'ajout de nouveaux clients</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notificationSettings.newClients}
                    onChange={() => handleNotificationToggle('newClients')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Enregistrer les préférences
              </button>
            </div>
          </div>
        );
        
      case 'preferences':
        return (
          <form onSubmit={handlePreferencesSubmit}>
            <h2 className="text-base font-semibold mb-4">Préférences d'interface</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thème</label>
                <select
                  name="theme"
                  value={preferencesForm.theme}
                  onChange={handlePreferencesChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="system">Système</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Densité d'affichage</label>
                <select
                  name="density"
                  value={preferencesForm.density}
                  onChange={handlePreferencesChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="comfortable">Confortable</option>
                  <option value="compact">Compacte</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button type="submit" className={`bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {isLoading ? 'Enregistrement...' : 'Enregistrer les préférences'}
              </button>
            </div>
          </form>
        );
        
      case 'privacy':
        return (
          <div>
            <h2 className="text-base font-semibold mb-4">Vie privée</h2>
            <div className="space-y-4">
              <button onClick={handleExportData} className="bg-accent text-white py-2 px-4 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faSave} className="mr-2" />Exporter mes données
              </button>
              <button onClick={handleDeleteAccount} className="bg-red-600 text-white py-2 px-4 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faTrash} className="mr-2" />Supprimer mon compte
              </button>
            </div>
          </div>
        );
        
      case 'integrations':
        return (
          <div>
            <h2 className="text-base font-semibold mb-4">Intégrations & API</h2>
            <button onClick={handleGenerateApiKey} className="bg-accent text-white py-2 px-4 rounded-lg flex items-center mb-4">
              <FontAwesomeIcon icon={faKey} className="mr-2" />Générer une nouvelle clé API
            </button>
            <div className="space-y-2">
              {apiKeys.length === 0 && <p className="text-sm text-gray-500">Aucune clé API pour le moment.</p>}
              {apiKeys.map(k => (
                <div key={k.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                  <span className="font-mono text-sm break-all">{k.key}</span>
                  <button onClick={() => handleRevokeKey(k.id)} className="text-red-600 text-sm">Révoquer</button>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'security':
        return (
          <div>
            <h2 className="text-base font-semibold mb-4">Paramètres de sécurité</h2>
            <div className="space-y-6">
              <form onSubmit={handlePasswordChange}>
                <h3 className="text-sm font-medium mb-3">Changer le mot de passe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={securityForm.currentPassword}
                      onChange={handleSecurityChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="h-px bg-gray-200 my-2"></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={securityForm.newPassword}
                      onChange={handleSecurityChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button 
                    type="submit"
                    className={`bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon icon={faLock} className="mr-2" />
                    {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                  </button>
                </div>
              </form>
              
              {/* 2FA Toggle */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium">Authentification à deux facteurs (2FA)</h3>
                  <p className="text-sm text-gray-500">Ajoute une couche de sécurité supplémentaire à votre compte</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={is2FAEnabled}
                    onChange={handle2FAToggle}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>

              <div className="h-px bg-gray-200 my-6"></div>

              <div>
                <h3 className="text-sm font-medium mb-3">Sessions actives</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Session actuelle</p>
                      <p className="text-sm text-gray-500">Libreville, Gabon · Chrome sur Windows</p>
                      <p className="text-xs text-gray-400 mt-1">Démarré le 28 Nov 2023, 09:23</p>
                    </div>
                    <span className="bg-success/20 text-success text-xs rounded-full px-3 py-1">Actif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'users':
        return user?.role !== 'admin' ? null : (
          <div>
            <h2 className="text-base font-semibold mb-4">Gestion des utilisateurs</h2>
            {/* Liste */}
            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Accréditation</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.accreditation}</td>
                    <td>
                      {u.id !== user.id && (
                        <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 text-xs">
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Ajout */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Ajouter un utilisateur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Nom"
                  className="border border-gray-300 rounded px-3 py-2"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                />
                <input
                  placeholder="Email"
                  className="border border-gray-300 rounded px-3 py-2"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                />
                <select
                  value={newUser.role}
                  onChange={e => {
                    const r = e.target.value as Role;
                    setNewUser({ ...newUser, role: r, permissions: [...ROLE_PERMISSIONS[r]] });
                  }}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  <option value="agent">Agent</option>
                  <option value="supervisor">Superviseur</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  value={newUser.accreditation}
                  onChange={e => setNewUser({ ...newUser, accreditation: e.target.value as AccreditationLevel })}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                </select>
                <input
                  placeholder="Mot de passe"
                  type="password"
                  className="border border-gray-300 rounded px-3 py-2"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                />
                <div className="md:col-span-2">
                  <p className="text-sm font-medium mb-2">Modules autorisés</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.values(Permission).map((perm) => (
                      <label key={perm} className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          checked={newUser.permissions.includes(perm as Permission)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setNewUser((prev) => {
                              const perms = checked
                                ? [...prev.permissions, perm as Permission]
                                : prev.permissions.filter((p) => p !== perm);
                              return { ...prev, permissions: perms };
                            });
                          }}
                        />
                        <span>{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={handleAddUser} className="mt-4 bg-accent text-white px-4 py-2 rounded">
                Ajouter
              </button>
            </div>
          </div>
        );
        
      case 'legal':
        return (
          <div className="prose max-w-none">
            <h2 className="text-base font-semibold mb-4">Informations légales, confidentialité &amp; conformité</h2>

            {/* CGU */}
            <h3 className="mt-6 mb-2 font-semibold">1. Conditions générales d'utilisation (CGU)</h3>
            <p>
              L'accès et l'utilisation de l'application&nbsp;<strong>DMT&nbsp;Sécurité</strong> impliquent
              l'acceptation sans réserve des présentes&nbsp;CGU. Celles-ci peuvent être modifiées à tout moment ;
              l'utilisateur est invité à les consulter régulièrement. L'usage est strictement réservé à des fins
              professionnelles internes ou contractuellement prévues avec&nbsp;DMT Sécurité.
            </p>

            {/* Données collectées */}
            <h3 className="mt-6 mb-2 font-semibold">2. Données collectées</h3>
            <ul className="list-disc list-inside">
              <li><strong>Données d'identification&nbsp;:</strong> nom, prénom, adresse e-mail, numéro de téléphone, rôle, langue.</li>
              <li><strong>Données de connexion&nbsp;:</strong> journaux d'accès, adresse IP, type de navigateur, horodatages.</li>
              <li><strong>Données opérationnelles&nbsp;:</strong> missions, planning, localisation d'équipements, rapports.</li>
              <li><strong>Données issues de la caméra&nbsp;:</strong> flux vidéo et images capturées, métadonnées (heure, lieu), empreintes faciales vectorisées dans le cadre de la reconnaissance faciale.</li>
              <li><strong>Données biométriques&nbsp;:</strong> gabarits faciaux générés et stockés de manière chiffrée pour la vérification d'identité et le contrôle de présence.</li>
            </ul>

            {/* Finalités & bases légales */}
            <h3 className="mt-6 mb-2 font-semibold">3. Finalités et bases légales</h3>
            <p>Les traitements reposent sur&nbsp;:</p>
            <ul className="list-decimal list-inside">
              <li><em>L'exécution d'un contrat</em> : gestion des agents, missions, équipements et rapports.</li>
              <li><em>L'intérêt légitime</em> : sécurisation des locaux et des personnes via la vidéosurveillance et la reconnaissance faciale.</li>
              <li><em>Le consentement</em> : envoi de notifications marketing ou collecte de certains cookies analytiques.</li>
              <li><em>Le respect d'obligations légales</em> : archivage, comptabilité, réponses aux autorités compétentes.</li>
            </ul>

            {/* Utilisation de la caméra */}
            <h4 className="mt-4 mb-1 font-semibold">3.1 Utilisation de la caméra et des flux vidéo</h4>
            <p>
              Les caméras connectées permettent :
            </p>
            <ul className="list-disc list-inside">
              <li>la <strong>détection et vérification faciale</strong> des agents pour la pointage de présence ;</li>
              <li>la <strong>surveillance en temps réel</strong> des missions à risque ;</li>
              <li>la génération de <strong>preuves vidéos</strong> en cas d'incident.</li>
            </ul>
            <p>
              Les flux ne sont <strong>pas</strong> enregistrés en continu sauf configuration explicite. Les images capturées
              sont conservées <strong>30&nbsp;jours</strong> puis supprimées automatiquement, sauf si une investigation
              impose une conservation plus longue.
            </p>

            {/* Conservation */}
            <h3 className="mt-6 mb-2 font-semibold">4. Durées de conservation</h3>
            <table>
              <thead>
                <tr><th>Catégorie</th><th>Durée</th></tr>
              </thead>
              <tbody>
                <tr><td>Données de compte</td><td>Durée de la relation contractuelle + 5&nbsp;ans</td></tr>
                <tr><td>Logs de connexion</td><td>12&nbsp;mois</td></tr>
                <tr><td>Images &amp; vidéos</td><td>30&nbsp;jours</td></tr>
                <tr><td>Gabarits biométriques</td><td>Durée du contrat ou jusqu'à révocation du consentement</td></tr>
              </tbody>
            </table>

            {/* Partage */}
            <h3 className="mt-6 mb-2 font-semibold">5. Destinataires &amp; transferts</h3>
            <p>
              Les données sont accessibles aux équipes internes habilitées (opérations, sécurité&nbsp;IT, RH) et à nos
              prestataires sous-traitants (hébergement, notification push, traitement vidéo) agissant sur instruction
              stricte et soumis à des obligations de confidentialité conformes au&nbsp;RGPD. Aucun transfert hors Union
              européenne n'est réalisé sans garanties adéquates (clauses contractuelles types ou décision d'adéquation).
            </p>

            {/* Sécurité */}
            <h3 className="mt-6 mb-2 font-semibold">6. Mesures de sécurité</h3>
            <p>
              DMT Sécurité applique des mesures techniques et organisationnelles : chiffrement&nbsp;AES-256 des médias,
              stockage cloisonné, contrôle d'accès à plusieurs facteurs, journalisation, audits réguliers,
              tests d'intrusion et politique de sauvegarde chiffrée.
            </p>

            {/* Cookies */}
            <h3 className="mt-6 mb-2 font-semibold">7. Cookies &amp; traceurs</h3>
            <p>
              L'application web utilise uniquement des cookies essentiels au fonctionnement (session, préférence de
              thème). Aucun cookie publicitaire n'est déposé. Des statistiques anonymisées peuvent être collectées via
              <em>Matomo</em> ou équivalent, avec option d'opposition disponible dans le pied de page.
            </p>

            {/* Droits */}
            <h3 className="mt-6 mb-2 font-semibold">8. Vos droits</h3>
            <p>
              Vous disposez des droits d'accès, de rectification, d'effacement, de limitation, d'opposition, de
              portabilité et du droit de définir des directives post-mortem. Pour les données biométriques, vous
              pouvez retirer votre consentement à tout moment&nbsp;: votre gabarit facial sera alors supprimé dans un
              délai de 30&nbsp;jours.
            </p>

            {/* DPO */}
            <h3 className="mt-6 mb-2 font-semibold">9. Contact Délégué à la protection des données (DPO)</h3>
            <p>
              Courriel&nbsp;: dpo@dmt-securite.example • Téléphone&nbsp;: +241&nbsp;01&nbsp;02&nbsp;03&nbsp;99.<br/>
              Adresse&nbsp;: DPO — Digital Monitoring &amp; Tracking, BP 12345, Libreville.
            </p>

            {/* Mises à jour */}
            <h3 className="mt-6 mb-2 font-semibold">10. Mise à jour de la présente politique</h3>
            <p>
              Cette notice est susceptible d'évoluer pour refléter les changements législatifs ou fonctionnels. La
              date de dernière mise à jour est indiquée ci-dessous. Les utilisateurs seront notifiés en cas de
              changements majeurs.
            </p>

            {/* Crédits */}
            <h3 className="mt-6 mb-2 font-semibold">11. Crédits &amp; licences open-source</h3>
            <ul className="list-disc list-inside">
              <li>Icônes&nbsp;: FontAwesome (CC BY 4.0), Lucide-React.</li>
              <li>Frameworks&nbsp;: React, Vite, Tailwind CSS (licence MIT).</li>
              <li>Reconnaissance faciale&nbsp;: face-api.js, TensorFlow.js.</li>
            </ul>

            {/* Sous-traitants */}
            <h3 className="mt-6 mb-2 font-semibold">12. Sous-traitants &amp; hébergement</h3>
            <p>Nos principaux prestataires :</p>
            <ul className="list-disc list-inside">
              <li><strong>AWS EU-Central-1 (Francfort)</strong> — hébergement des serveurs et base de données chiffrée (KMS).</li>
              <li><strong>Google Firebase Cloud Messaging</strong> — acheminement des notifications push.</li>
              <li><strong>Stripe, Inc.</strong> — traitement des paiements (données financières pseudonymisées).</li>
              <li><strong>OVHCloud</strong> — sauvegardes chiffrées hors-site dans l'Union européenne.</li>
            </ul>
            <p>Des clauses contractuelles types (CCT) encadrent tout transfert hors UE.</p>

            {/* Analyse d'impact & conformité */}
            <h3 className="mt-6 mb-2 font-semibold">13. Analyse d'impact (AIPD) &amp; audit</h3>
            <p>
              Une AIPD (DPIA) spécifique au module de reconnaissance faciale a été conduite conformément à l'article 35 du RGPD ;
              le registre des traitements est disponible sur demande. Des audits de sécurité et de conformité sont
              réalisés chaque année par un tiers indépendant certifié PASSI.
            </p>

            {/* Notification de violation */}
            <h3 className="mt-6 mb-2 font-semibold">14. Procédure en cas de violation de données</h3>
            <p>
              Toute violation de sécurité présentant un risque pour les droits et libertés des personnes est notifiée
              à la CNIL dans un délai maximal de <strong>72 heures</strong> après détection. Les personnes concernées
              sont informées sans délai lorsque la violation est susceptible d'engendrer un risque élevé.
            </p>

            <p className="text-sm mt-4 italic">Dernière mise à jour&nbsp;: {new Date().toLocaleDateString()}</p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-6">
        <h1 className="text-xl font-bold">Paramètres</h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 bg-gray-50 md:border-r border-gray-200">
            <div className="p-4">
              <div className="flex flex-col">
                <button
                  className={`flex items-center px-4 py-3 rounded-lg mb-1 ${activeTab === 'profile' ? 'bg-accent text-white' : 'hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <FontAwesomeIcon icon={faUser} className="mr-3" />
                  <span>Profil</span>
                </button>
                
                <button
                  className={`flex items-center px-4 py-3 rounded-lg mb-1 ${activeTab === 'company' ? 'bg-accent text-white' : 'hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('company')}
                >
                  <FontAwesomeIcon icon={faBuilding} className="mr-3" />
                  <span>Entreprise</span>
                </button>
                
                <button
                  className={`flex items-center px-4 py-3 rounded-lg mb-1 ${activeTab === 'notifications' ? 'bg-accent text-white' : 'hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <FontAwesomeIcon icon={faBell} className="mr-3" />
                  <span>Notifications</span>
                </button>
                
                <button
                  className={`flex items-center px-4 py-3 rounded-lg mb-1 ${activeTab === 'preferences' ? 'bg-accent text-white' : 'hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('preferences')}
                >
                  <FontAwesomeIcon icon={faPalette} className="mr-3" />
                  <span>Préférences</span>
                </button>
                
                <button
                  className={`flex items-center px-4 py-3 rounded-lg mb-1 ${activeTab === 'privacy' ? 'bg-accent text-white' : 'hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('privacy')}
                >
                  <FontAwesomeIcon icon={faUserShield} className="mr-3" />
                  <span>Vie privée</span>
                </button>
                
                <button
                  className={`flex items-center px-4 py-3 rounded-lg mb-1 ${activeTab === 'security' ? 'bg-accent text-white' : 'hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('security')}
                >
                  <FontAwesomeIcon icon={faLock} className="mr-3" />
                  <span>Sécurité</span>
                </button>
                
                <button
                  className={`flex items-center px-4 py-3 rounded-lg mb-1 ${activeTab === 'integrations' ? 'bg-accent text-white' : 'hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('integrations')}
                >
                  <FontAwesomeIcon icon={faKey} className="mr-3" />
                  <span>Intégrations</span>
                </button>

                {user?.role === 'admin' && (
                  <button
                    className={`flex items-center px-4 py-3 rounded-lg mb-1 ${activeTab === 'users' ? 'bg-accent text-white' : 'hover:bg-gray-200'}`}
                    onClick={() => setActiveTab('users')}
                  >
                    <FontAwesomeIcon icon={faUsers} className="mr-3" />
                    <span>Utilisateurs</span>
                  </button>
                )}

                <button
                  className={`flex items-center px-4 py-3 rounded-lg mb-1 ${activeTab === 'legal' ? 'bg-accent text-white' : 'hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('legal')}
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-3" />
                  <span>Légal</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 