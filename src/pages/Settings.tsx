import React, { useState, useEffect } from 'react';
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
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userService } from '../services/userService';
import { companyService } from '../services/companyService';
import { ProfileFormData, NotificationSettings, PasswordFormData } from '../types/user';
import { CompanyFormData } from '../types/company';

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

  // 2-Factor Authentication state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Integrations – dummy API keys list
  const [apiKeys, setApiKeys] = useState<{ id: string; key: string }[]>([]);

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
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Send to backend
      localStorage.setItem('theme', preferencesForm.theme);
      localStorage.setItem('density', preferencesForm.density);
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