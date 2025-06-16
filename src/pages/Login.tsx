import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faUser, faLock, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (!success) {
        setError('Identifiants invalides');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yale-blue via-berkeley-blue to-oxford-blue">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-lg">
        {/* Logo et titre */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-yale-blue/10 p-4 rounded-full shadow-lg mb-4">
            <FontAwesomeIcon icon={faShieldAlt} className="text-yale-blue text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-oxford-blue">DMT Sécurité</h1>
          <p className="text-sm text-berkeley-blue/70 mt-1">Accès à votre espace sécurisé</p>
        </div>
        
        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <FontAwesomeIcon icon={faCircleExclamation} className="text-red-500 mr-3 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ nom d'utilisateur */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-oxford-blue">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faUser} className="text-berkeley-blue/70 text-sm" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-powder-blue/30 rounded-lg bg-white focus:ring-2 focus:ring-yale-blue focus:border-yale-blue sm:text-sm transition-all"
                placeholder="admin"
              />
            </div>
          </div>
          
          {/* Champ mot de passe */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-oxford-blue">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-berkeley-blue/70 text-sm" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-powder-blue/30 rounded-lg bg-white focus:ring-2 focus:ring-yale-blue focus:border-yale-blue sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          {/* Option se souvenir de moi */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-yale-blue focus:ring-yale-blue border-powder-blue/30 rounded transition-all"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-oxford-blue">
                Se souvenir de moi
              </label>
            </div>
          </div>
          
          {/* Bouton de connexion */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-yale-blue hover:bg-berkeley-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yale-blue transition-all ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </form>
        
        {/* Séparateur */}
        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-powder-blue/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-berkeley-blue/70">Connexion de démonstration</span>
          </div>
        </div>
        
        {/* Infos de démo */}
        <div className="mt-4 p-4 bg-powder-blue/10 border border-powder-blue/30 rounded-lg">
          <p className="text-center text-sm text-berkeley-blue">
            Utilisez <span className="font-semibold">admin</span> et <span className="font-semibold">admin123</span> pour vous connecter
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-white/70">© {new Date().getFullYear()} DMT Sécurité. Tous droits réservés.</p>
      </div>
    </div>
  );
};

export default Login; 