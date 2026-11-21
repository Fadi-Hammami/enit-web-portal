# Guide d'utilisation de MySQL Workbench pour ENIT Database

## 1. Connexion à MySQL
1.  Ouvrez **MySQL Workbench**.
2.  Cliquez sur la connexion "Local instance MySQL80" (ou votre connexion par défaut).
    *   Si demandé, entrez le mot de passe que vous avez configuré lors de l'installation.

## 2. Création de la Base de Données
1.  Dans le menu en haut, cliquez sur **File** > **Open SQL Script...**.
2.  Naviguez vers le dossier de votre projet : `c:\Users\LOQ\Desktop\dev web\tp 1\database`.
3.  Sélectionnez le fichier `schema.sql`.
4.  Le fichier s'ouvre dans l'éditeur. cherchez l'icône "Éclair" (⚡) dans la barre d'outils juste au-dessus du code SQL.
5.  Cliquez sur l'éclair pour exécuter tout le script.

## 3. Vérification
1.  Dans le panneau de gauche "Navigator", onglet "Schemas", faites un clic droit dans le vide et choisissez "Refresh All".
2.  Vous devriez voir apparaitre `enit_db`.
3.  Déroulez `enit_db` > `Tables`, vous devriez voir `events`.
4.  Faites un clic droit sur `events` > "Select Rows - Limit 1000" pour voir les données insérées.

## 4. Démarrer le Serveur Backend
Une fois la base de données prête :
1.  Ouvrez un terminal dans le dossier `backend`.
2.  Lancez : `node server.js`
3.  Vous devez voir : `Connecté à la base de données MySQL.`

Si vous avez une erreur "Access denied", cela signifie que la variable d'environnement `DB_PASSWORD` n'est pas définie ou n'est pas le bon mot de passe MySQL.
