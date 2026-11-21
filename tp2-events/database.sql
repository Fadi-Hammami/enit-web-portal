-- CRÉATION DE LA BASE DE DONNÉES
CREATE DATABASE IF NOT EXISTS tp2_events;
USE tp2_events;

-- CRÉATION DE LA TABLE DES ÉVÉNEMENTS
CREATE TABLE IF NOT EXISTS events (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    titre       VARCHAR(255) NOT NULL,
    date        DATE NOT NULL,
    lieu        VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    adresse     VARCHAR(500),
    lat         DECIMAL(10, 6),
    lng         DECIMAL(10, 6),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OPTIONNEL : AJOUT D'UN ÉVÉNEMENT DE TEST
INSERT INTO events (titre, date, lieu, description, adresse) 
VALUES ('Forum ENIT', '2026-07-02', 'Amphi A', 'Forum annuel de l\'ENIT', 'ENIT, Tunis');

-- VÉRIFICATION
SELECT * FROM events;
