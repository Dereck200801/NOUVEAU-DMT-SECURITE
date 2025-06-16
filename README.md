# DMT Sécurité

Application de gestion pour DMT Sécurité.

## Configuration

### Google Maps API

Pour utiliser la fonctionnalité de cartographie, vous devez configurer une clé API Google Maps:

1. Créez un projet dans la [Console Google Cloud](https://console.cloud.google.com/)
2. Activez l'API Maps JavaScript
3. Créez une clé API avec les restrictions appropriées
4. Ajoutez votre clé API dans le fichier `.env` à la racine du projet:

```
VITE_GOOGLE_MAPS_API_KEY=VOTRE_CLE_API_GOOGLE_MAPS
```

## Scripts disponibles

Dans le répertoire du projet, vous pouvez exécuter:

### `npm run dev`

Lance l'application en mode développement.\
Ouvrez [http://localhost:5173](http://localhost:5173) pour la visualiser dans votre navigateur.

La page se rechargera si vous apportez des modifications.\
Vous verrez également les erreurs de lint dans la console.

### `npm run build`

Compile l'application pour la production dans le dossier `dist`.\
Elle regroupe correctement React en mode production et optimise la compilation pour les meilleures performances.

La compilation est minifiée et les noms de fichiers incluent des hachages.\
Votre application est prête à être déployée!

### `npm run mock-api`

Lance un serveur API mock basé sur json-server pour le développement.

### `npm run server:dev`

Lance le serveur backend en mode développement avec rechargement automatique.

### `npm run server:build`

Compile le serveur backend pour la production.

### `npm run server:start`

Lance le serveur backend compilé pour la production.
