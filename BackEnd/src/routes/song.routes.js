const express = require('express');
const multer = require('multer');
const uploadFile = require('../service/storage.service');
const router = express.Router();
const songmodel = require("../models/song.models"); // ✅ fixed import (matches your file name)

// Use memory storage (keeps file in buffer instead of saving it)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to upload a song
router.post('/songs', upload.single('audio'), async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('File:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Upload file to ImageKit
    const fileData = await uploadFile(req.file);
    console.log('Uploaded File:', fileData);

    // Save song info to MongoDB
    const song = await songmodel.create({
      title: req.body.title,
      artist: req.body.artist,
      audio: fileData.url,
      mood: req.body.mood,
    });

    res.status(201).json({
      message: 'Song uploaded successfully!',
      song,
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Something went wrong during upload' });
  }
});

module.exports = router;
