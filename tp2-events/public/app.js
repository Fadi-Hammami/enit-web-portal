// ========== CONFIGURATION ==========
const BASE_URL = "http://localhost:3001/events";
let eventsList = [];
let lat, lng;
let marker;
let selectedEvent = null;

// ========== INITIALISATION CARTE LEAFLET ==========
const map = L.map('map').setView([36.8, 10.18], 13); // Centré sur Tunis

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Clic sur la carte pour placer un marqueur
map.on('click', function (e) {
    lat = e.latlng.lat;
    lng = e.latlng.lng;

    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(map);

    document.getElementById('adresse').value =
        `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
});

// ========== GÉOLOCALISATION PAR ADRESSE ==========
function localiserAdresse() {
    const adr = document.getElementById('adresse').value;
    if (!adr) {
        alert('⚠️ Veuillez entrer une adresse');
        return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${adr}`)
        .then(r => r.json())
        .then(d => {
            if (d.length > 0) {
                lat = d[0].lat;
                lng = d[0].lon;

                if (marker) map.removeLayer(marker);
                marker = L.marker([lat, lng]).addTo(map);
                map.setView([lat, lng], 14);

                alert('✅ Adresse localisée avec succès !');
            } else {
                alert('❌ Adresse introuvable');
            }
        })
        .catch(err => {
            console.error(err);
            alert('❌ Erreur lors de la géolocalisation');
        });
}

// ========== CHARGEMENT DES ÉVÉNEMENTS ==========
async function fetchEvents() {
    try {
        const response = await fetch(BASE_URL);
        eventsList = await response.json();
        displayEvents(eventsList);
    } catch (error) {
        console.error("Erreur:", error);
        alert('❌ Impossible de charger les événements');
    }
}

// ========== AFFICHAGE DES ÉVÉNEMENTS ==========
function displayEvents(events) {
    const list = document.getElementById("eventsList");
    list.innerHTML = "";

    if (events.length === 0) {
        list.innerHTML = '<p class="text-gray-500 italic p-4 text-center">Aucun événement planifié.</p>';
        return;
    }

    events.forEach(event => {
        const li = document.createElement("li");
        li.className = 'bg-gray-50 p-4 border-l-4 border-blue-900 shadow-sm hover:bg-gray-100 transition';
        li.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-xl font-bold text-blue-900">${event.titre}</h3>
                    <p class="text-sm text-gray-600 mb-2">📅 ${event.date} | 📍 ${event.lieu}</p>
                    <p class="text-gray-800 leading-relaxed">${event.description}</p>
                    ${event.adresse ? `<p class="text-xs text-blue-600 mt-2">🗺️ ${event.adresse}</p>` : ''}
                </div>
                <button onclick="deleteEvent(${event.id})"
                        class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition" title="Supprimer">
                    ✖
                </button>
            </div>
        `;
        list.appendChild(li);
    });
}

// ========== SOUMISSION DU FORMULAIRE ==========
const form = document.getElementById("eventForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newEvent = {
        titre: form.titre.value,
        date: form.date.value,
        lieu: form.lieu.value,
        description: form.description.value,
        adresse: form.adresse.value,
        lat: lat || null,
        lng: lng || null
    };

    try {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEvent)
        });

        if (res.ok) {
            alert('✅ Événement créé avec succès !');
            form.reset();
            if (marker) map.removeLayer(marker);
            lat = null;
            lng = null;
            fetchEvents();
        }
    } catch (err) {
        console.error('Erreur:', err);
        alert('❌ Erreur de connexion au serveur');
    }
});

// ========== SUPPRESSION D'UN ÉVÉNEMENT ==========
async function deleteEvent(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

    try {
        const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
        if (res.ok) {
            alert('🗑️ Événement supprimé');
            fetchEvents();
        }
    } catch (err) {
        console.error('Erreur:', err);
        alert('❌ Erreur lors de la suppression');
    }
}

// ========== CHATBOT ==========
const chatbox = document.getElementById('chatbox');
const questionInput = document.getElementById('question');

function addMsg(txt, type) {
    const icon = type === 'bot' ? '🤖' : '👤';
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${type}`;

    msgDiv.innerHTML = `
        ${type === 'bot' ? `<span class="chat-icon">${icon}</span>` : ''}
        <div class="chat-bubble ${type}">
            ${txt}
        </div>
        ${type === 'user' ? `<span class="chat-icon">${icon}</span>` : ''}
    `;

    chatbox.appendChild(msgDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function askBot() {
    const q = questionInput.value.trim();
    if (!q) return;

    addMsg(q, "user");
    questionInput.value = "";

    if (!selectedEvent) {
        const ev = eventsList.find(e =>
            e.titre.toLowerCase() === q.toLowerCase()
        );

        if (ev) {
            selectedEvent = ev;
            addMsg(`Événement "${selectedEvent.titre}" sélectionné. Posez vos questions sur la date, le lieu ou la description.`, "bot");
        } else {
            addMsg(`Aucun événement nommé "${q}". Réessayez avec le nom exact.`, "bot");
        }
        return;
    }

    let response = "Je ne dispose pas de cette information.";
    const lq = q.toLowerCase();

    if (lq.includes("date")) {
        response = `La date est : ${selectedEvent.date}`;
    } else if (lq.includes("lieu")) {
        response = `Le lieu est : ${selectedEvent.lieu}`;
    } else if (lq.includes("description")) {
        response = `Description : ${selectedEvent.description}`;
    } else if (lq.includes("adresse")) {
        response = selectedEvent.adresse
            ? `Adresse : ${selectedEvent.adresse}`
            : "Aucune adresse renseignée.";
    } else if (lq.includes("changer") || lq.includes("autre")) {
        selectedEvent = null;
        response = "D'accord ! Quel événement voulez-vous interroger ?";
    }

    addMsg(response, "bot");
}

// Message d'accueil au chargement
addMsg("Bonjour ! Quel événement voulez-vous interroger ?", "bot");

// ========== INITIALISATION & LISTENERS ==========
window.addEventListener('DOMContentLoaded', () => {
    fetchEvents();

    // Listener pour bouton localiser
    const btnLocaliser = document.getElementById('btnLocaliser');
    if (btnLocaliser) btnLocaliser.addEventListener('click', localiserAdresse);

    // Listeners pour Chatbot
    const btnAskBot = document.getElementById('btnAskBot');
    if (btnAskBot) btnAskBot.addEventListener('click', askBot);

    const questionInput = document.getElementById('question');
    if (questionInput) {
        questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') askBot();
        });
    }
});
