const express = require('express');
const songRoutes = require('./routes/song.routes');
const app = express();

app.use(express.json());
app.use('/api', songRoutes);   // ✅ IMPORTANT: /api prefix lagao

module.exports = app;
