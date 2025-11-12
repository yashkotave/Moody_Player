import React, { useState } from 'react';
import { useEffect } from 'react';

const MoodSongs = ({mood}) => {

  
 const [songs, setSongs] = useState([]);

  useEffect(()=>{

    console.log("mood chaged : " , mood)
  fetch(`http://localhost:3000/api/songs?mood=${encodeURIComponent(mood)}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Songs:", data.songs[0].audio);
    setSongs(data.songs);
    
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
  },[mood]);

 

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold text-center text-cyan-400 mb-5">
        Songs for your Mood is : {mood}
      </h2>

      {songs.map((song, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-white/5 hover:bg-white/10 transition-all rounded-xl px-4 py-3 mb-3"
        >
          <div className="title">
            <h3 className="text-lg font-medium text-white">{song.title}1</h3>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>

          <div className="play-pause-button flex gap-3 text-cyan-400 text-2xl">
            {/* <i className="ri-pause-line cursor-pointer hover:text-cyan-300 transition-all"></i>
            <i className="ri-play-circle-fill cursor-pointer hover:text-cyan-300 transition-all"></i> */}

             <audio controls src={song.audio} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoodSongs;
