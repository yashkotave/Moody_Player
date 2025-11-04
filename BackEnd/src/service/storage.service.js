const ImageKit = require("imagekit");
require("dotenv").config();
const mongoose = require("mongoose");

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT, // ✅ correct
});

function uploadFile(file) {
  return new Promise((resolve, reject) => {
    imageKit.upload(
      {
        file: file.buffer, // actual file buffer
        fileName: file.originalname || new mongoose.Types.ObjectId().toString(), // ✅ single fileName key
      },
      (error, result) => {
        if (error) {
          console.error("❌ ImageKit upload error:", error);
          reject(error);
        } else {
          console.log("✅ Image uploaded successfully:", result.url);
          resolve(result);
        }
      }
    );
  });
}

module.exports = uploadFile;
