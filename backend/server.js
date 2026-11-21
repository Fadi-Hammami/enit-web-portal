const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000; // Garder 3000 si vous n'avez qu'un seul serveur en cours, ou changez si besoin.

app.use(cors());
app.use(express.json());

// Configuration de la base de données
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'enit_db'
});

db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à enit_db:', err);
        return;
    }
    console.log('✅ Connecté à enit_db (Projet 1)');
});

// Connexion à la deuxième base de données (tp2_events)
const db2 = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'tp2_events'
});

db2.connect(err => {
    if (err) {
        console.error('Erreur de connexion à tp2_events:', err);
        return;
    }
    console.log('✅ Connecté à tp2_events (Projet 2)');
});

// Route pour l'inscription d'un simple utilisateur
app.post('/api/register', (req, res) => {
    const { nom, prenom, classe, cin, telephone, email, password } = req.body;
    const sql = 'INSERT INTO users (nom, prenom, classe, cin, telephone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nom, prenom, classe, cin, telephone, email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erreur MySQL : " + err.message });
        }
        res.json({ message: "Inscription réussie !" });
    });
});

// Route pour la connexion (Admin ou Simple User)
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;
    const table = role === 'admin' ? 'admins' : 'users';
    const sql = `SELECT * FROM ${table} WHERE email = ? AND password = ?`;

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false, message: "Email ou mot de passe incorrect." });
        }
    });
});

// Route pour récupérer les événements
app.get('/api/events', (req, res) => {
    const sql = 'SELECT * FROM events';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Route spéciale pour ajouter un événement dans les DEUX bases
app.post('/api/add-event-dual', (req, res) => {
    const { titre, description, date, lieu } = req.body;

    // 1. Ajout dans enit_db (Projet 1)
    const sql1 = 'INSERT INTO events (title, description, image_url) VALUES (?, ?, ?)';
    const placeholder_img = '../image/enit_cover.jpg';

    db.query(sql1, [titre, description, placeholder_img], (err1) => {
        if (err1) {
            console.error('Erreur insertion base 1:', err1);
            return res.status(500).json({ error: "Erreur base Projet 1" });
        }

        // 2. Ajout dans tp2_events (Projet 2)
        const sql2 = 'INSERT INTO events (titre, date, lieu, description) VALUES (?, ?, ?, ?)';
        db2.query(sql2, [titre, date, lieu, description], (err2) => {
            if (err2) {
                console.error('Erreur insertion base 2:', err2);
                return res.status(500).json({ error: "Erreur base Projet 2" });
            }
            res.json({ success: true, message: "Événement ajouté dans les deux bases !" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
