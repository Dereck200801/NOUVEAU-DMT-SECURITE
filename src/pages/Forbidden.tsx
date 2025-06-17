import React from 'react';

const Forbidden: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center">
    <h1 className="text-5xl font-bold text-yale-blue mb-4">403</h1>
    <p className="text-lg text-berkeley-blue mb-6">Vous n'avez pas l'autorisation d'accéder à cette page.</p>
    <a href="/dashboard" className="text-yale-blue underline">Retour au tableau de bord</a>
  </div>
);

export default Forbidden;
