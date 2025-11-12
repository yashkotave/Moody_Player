import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Camera, CameraOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MoodSongs from "./MoodSongs";

export default function FaceDetector({mood,onMoodChange}) {
  const videoRef = useRef(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [moodLabel, setMoodLabel] = useState("😶 Waiting...");
  const intervalRef = useRef(null);

  // Load face-api models
  useEffect(() => {
    if (!permissionGranted) return;
    const loadModels = async () => {
      try {
        setLoading(true);
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        setModelsLoaded(true);
      } catch (err) {
        console.error(err);
        setError("Failed to load face detection models.");
      } finally {
        setLoading(false);
      }
    };
    loadModels();
  }, [permissionGranted]);

  // Camera controls
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraOn(true);
      }
    } catch (err) {
      console.error(err);
      setError("Camera access denied or unavailable.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraOn(false);
      stopDetection();
      setMoodLabel("😶 Waiting...");
    }
  };

  // Detection logic
  const startDetection = () => {
    if (!modelsLoaded || !cameraOn) return;
    setDetecting(true);

    intervalRef.current = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        const maxValue = Math.max(...Object.values(expressions));
        const detectedMood = Object.keys(expressions).find(
          (key) => expressions[key] === maxValue
        );

        const moodMap = {
          happy: "😊 Happy",
          sad: "😢 Sad",
          angry: "😡 Angry",
          surprised: "😲 Surprised",
          disgusted: "🤢 Disgusted",
          fearful: "😨 Fearful",
          neutral: "😐 Neutral",
        };

        onMoodChange(detectedMood);
        setMoodLabel(moodMap[detectedMood] || "😶 Unknown");
      } else {
        onMoodChange("neutral");
        setMoodLabel("😶 No face detected");
      }
    }, 800);
  };

  const stopDetection = () => {
    clearInterval(intervalRef.current);
    setDetecting(false);
  };

  // Animation variants
  const cameraVariants = {
    center: { x: 0, opacity: 1, scale: 1 },
    left: { x: "-40%", opacity: 1, scale: 0.95 },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white overflow-hidden p-6">
      {/* PERMISSION SCREEN */}
      {!permissionGranted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <h1 className="text-3xl font-semibold tracking-wide">
            🎥 Face Detection Access 
          </h1>
          <p className="text-gray-300 max-w-md">
            We need your permission to access your camera for mood detection.
          </p>
          <button
            onClick={() => setPermissionGranted(true)}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all duration-300 shadow-lg font-medium"
          >
            Allow Camera Access
          </button>
        </motion.div>
      ) : loading ? (
        <p className="text-gray-400 text-lg animate-pulse">Loading models...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="relative flex w-full max-w-7xl justify-center items-center">
          {/* CAMERA BOX */}
          <motion.div
            variants={cameraVariants}
            animate={detecting ? "left" : "center"}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="rounded-2xl shadow-2xl border border-gray-700"
                width="480"
                height="360"
              />
              <button
                onClick={cameraOn ? stopCamera : startCamera}
                className="absolute top-4 right-4 p-3 rounded-full bg-gray-800/70 hover:bg-gray-700 transition-all duration-200 shadow-md"
              >
                {cameraOn ? (
                  <CameraOff className="w-6 h-6 text-red-400" />
                ) : (
                  <Camera className="w-6 h-6 text-green-400" />
                )}
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={startDetection}
                disabled={!modelsLoaded || !cameraOn || detecting}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  detecting
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500 shadow-lg"
                }`}
              >
                Start Detection 
              </button>

              <button
                onClick={stopDetection}
                disabled={!detecting}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  detecting
                    ? "bg-red-600 hover:bg-red-500 shadow-lg"
                    : "bg-gray-700 cursor-not-allowed"
                }`}
              >
                Stop Detection
              </button>
            </div>

            <motion.div
              key={moodLabel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`text-xl font-semibold px-6 py-3 rounded-xl shadow-md ${
                mood === "happy"
                  ? "bg-green-600/30 text-green-400"
                  : mood === "sad"
                  ? "bg-blue-600/30 text-blue-400"
                  : mood === "angry"
                  ? "bg-red-600/30 text-red-400"
                  : "bg-gray-700/50 text-gray-200"
              }`}
            >
              Current Mood: <span className="font-bold">{moodLabel}</span>
              
            </motion.div>
          </motion.div>

          {/* MOOD SONGS (Animate In on detection start) */}
          <AnimatePresence>
            {detecting && (
              <motion.div
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 200 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute right-0 w-[380px]"
              >
                <MoodSongs mood={mood} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
