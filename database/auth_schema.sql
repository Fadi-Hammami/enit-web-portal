USE enit_db;

-- Table pour les Administrateurs
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    cin VARCHAR(8) UNIQUE,
    post VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

-- Table pour les Simples Utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    classe VARCHAR(50),
    cin VARCHAR(8) UNIQUE,
    telephone VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

-- Admin par défaut (exemple : à modifier, ne jamais utiliser ce mot de passe en production)
INSERT IGNORE INTO admins (nom, prenom, cin, post, email, password) 
VALUES ('admin', 'admin', '00000000', "chef d'etude", 'admin@example.com', 'changeme');
