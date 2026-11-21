CREATE DATABASE IF NOT EXISTS enit_db;
USE enit_db;

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255)
);

-- Insertion des données initiales (basées sur votre site actuel)
INSERT INTO events (title, description, image_url) VALUES 
('Forum ENIT Entreprise', 'Grand événement de rencontre annuelle entre les futurs ingénieurs et les entreprises leaders.', '../image/463903340_848971827283209_8127339829150486396_n.jpg'),
('Cérémonie de remise de diplôme', 'Célébration solennelle de la réussite de nos étudiants et remise des diplômes nationaux.', '../image/cérémonie.jpg'),
('Octobre Rose à l''ENIT', 'Campagne de sensibilisation et événements caritatifs pour la lutte contre le cancer du sein.', '../image/octobre_rose.jpg'),
('Journée Ouvrages d''Art', 'Série de conférences et ateliers techniques centrés sur les grands projets de génie civil.', '../image/journee_ouvrage.jpg');
