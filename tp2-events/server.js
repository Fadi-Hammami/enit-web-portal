const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2');

// ========== CONFIGURATION ==========
const app = express();
const PORT = 3001;
const UPLOAD_DIR = 'uploads/';

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========== DATABASE CONNECTION ==========
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'tp2_events'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Erreur MySQL:', err.message);
        return;
    }
    console.log('✅ Base de données connectée (tp2_events)');
});

// ========== STORAGE ENGINE (Multer) ==========
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// ========== API ROUTES ==========

// File Upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier fourni' });
    res.json({ message: 'Upload réussi', filename: req.file.filename });
});

// GET /events
app.get('/events', (req, res) => {
    const sql = 'SELECT * FROM events ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('API Error (GET /events):', err.message);
            return res.status(500).json({ error: 'Erreur serveur lors de la récupération' });
        }
        res.json(results);
    });
});

// POST /events
app.post('/events', async (req, res) => {
    const { titre, date, lieu, description, adresse, lat, lng } = req.body;

    if (!titre || !date || !lieu || !description) {
        return res.status(400).json({ error: 'Données manquantes : titre, date, lieu et description sont requis.' });
    }

    try {
        // 1. Insertion locale dans tp2_events
        const sql = 'INSERT INTO events (titre, date, lieu, description, adresse, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [titre, date, lieu, description, adresse || null, lat || null, lng || null];

        db.query(sql, values, async (err, result) => {
            if (err) {
                console.error('API Error (POST /events):', err.message);
                return res.status(500).json({ error: 'Erreur lors de la création locale' });
            }

            // 2. Propagation vers Projet 1 (ENIT DB) via son API duale
            try {
                await fetch('http://localhost:3000/api/add-event-dual', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ titre, description, date, lieu })
                });
                console.log('✅ Événement synchronisé avec Projet 1');
            } catch (syncErr) {
                console.error('❌ Échec de synchronisation avec Projet 1:', syncErr.message);
                // On ne bloque pas la réponse car l'insertion locale a réussi
            }

            res.status(201).json({ id: result.insertId, ...req.body });
        });
    } catch (globalErr) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// DELETE /events/:id
app.delete('/events/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM events WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('API Error (DELETE /events):', err.message);
            return res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
        res.status(204).send();
    });
});

// Catch-all route (SPA support if needed)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========== SERVER START ==========
app.listen(PORT, () => {
    console.log(`🚀 Serveur actif sur http://localhost:${PORT}`);
});

