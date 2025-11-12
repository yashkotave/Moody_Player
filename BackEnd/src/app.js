const express = require('express');
const songRoutes = require('./routes/song.routes');
const app = express();
const cors = require('cors')

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use(express.json());
app.use('/api', songRoutes);   // ✅ IMPORTANT: /api prefix lagao
app.get('/',(req,res)=>{
    res.send("hello");
})
module.exports = app;
