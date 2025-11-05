const express = require("express");
const { getSongsByMood, uploadSong } = require("../controllers/song.controller");

const router = express.Router();

router.get("/songs", getSongsByMood); // ✅ GET route for mood-based songs
router.post("/upload", uploadSong);   // optional: POST route for new song

module.exports = router;
