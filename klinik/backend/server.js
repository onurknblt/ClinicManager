const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./api'); // API dosyasını import edin

const app = express();
const port = 3000;

// Ana rotayı login.html'e yönlendir
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/backend/functions', express.static(path.join(__dirname, 'functions')));


// API Rotalarını Bağla
app.use('/api', apiRoutes); // '/api' prefixi ekleniyor

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});
