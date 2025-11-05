const Song = require("../models/song.models");

// ✅ Get songs by mood
const getSongsByMood = async (req, res) => {
  try {
    const mood = (req.query.mood || "").toLowerCase();
    const songs = await Song.find({ mood });
    res.status(200).json({ success: true, songs });
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Upload song (if you have upload route)
const uploadSong = async (req, res) => {
  try {
    const { title, artist, mood, audio } = req.body;

    const newSong = new Song({
      title,
      artist,
      mood: mood.toLowerCase(), // ✅ make sure mood saved lowercase
      audio,
    });

    await newSong.save();
    res.status(201).json({ success: true, message: "Song uploaded", song: newSong });
  } catch (error) {
    console.error("Error uploading song:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getSongsByMood, uploadSong };
