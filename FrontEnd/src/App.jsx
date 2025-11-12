import { useState } from "react";
import FaceDetector from "./components/FacialExpression";
import MoodSongs from "./components/MoodSongs";

function App() {
  const [mood, setMood] = useState("neutral");

  return (
    <div>
      <FaceDetector
      mood={mood}
      onMoodChange={setMood}
      
      />
      {mood && <MoodSongs mood={mood} />}
    </div>
  );
}

export default App;
