# Portail ENIT : application web Full Stack

Application web composée de deux modules reliés à deux bases MySQL :
- **Portail public** (`frontend/tailwind.html`) : Tailwind CSS, Fetch API, authentification (Admin / utilisateur).
- **Module Admin** (`tp2-events`) : gestion d'événements, upload d'images (Multer), carte Leaflet.js, chatbot interrogeant la base.
- **Backend** (`backend`) : API REST Node.js / Express, connexion à `enit_db` et `tp2_events`, synchronisation `POST /api/add-event-dual`.

## Technologies
Node.js, Express.js, MySQL, Multer, HTML5, JavaScript (ES6+), Tailwind CSS, Leaflet.js.

## Installation
1. Installer Node.js et MySQL, puis créer les bases avec les scripts de `database/` (voir `database/INSTRUCTIONS.md`).
2. Définir les variables d'environnement (PowerShell) :
   ```powershell
   $env:DB_USER = "root"
   $env:DB_PASSWORD = "votre_mot_de_passe_mysql"
   ```
3. Lancer le backend :
   ```powershell
   cd backend
   npm install
   npm start
   ```
4. Lancer le module admin dans un second terminal :
   ```powershell
   cd tp2-events
   npm install
   npm start
   ```
5. Ouvrir `frontend/tailwind.html` dans le navigateur.

## Documentation
Voir `EXPLICATION_PROJET.txt` pour l'architecture détaillée.

## Limites connues (projet pédagogique)
Les mots de passe sont stockés en clair en base. Une version de production devrait utiliser un hachage (bcrypt) et des sessions ou JWT.

Projet réalisé à l'ENIT par Fedi Hammami.
