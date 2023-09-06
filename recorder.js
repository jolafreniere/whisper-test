import { spawn } from "child_process";
import fs from "fs/promises";
import { transcribe } from "./transcriber.js";
const recordAudio = async () => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(
      'C:\\ffmpeg\\ffmpeg.exe -f dshow -i audio="Microphone (3- USB PnP Audio Device)" -t 10 audio.wav',
      { shell: true }
    );

    ffmpeg.on("close", (code) => {
      if (code !== 0) {
        console.log(`FFmpeg exited with code ${code}`);
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
      console.log("Recording has ended.");
      resolve();
    });

    ffmpeg.on("error", (error) => {
      console.log("An error occurred:", error);
      reject(error);
    });
  });
};

const main = async () => {
  try {
    let exit = false;
    try {
      await fs.unlink("./audio.wav");
    } catch (error) {}
    while (!exit) {
      await recordAudio();
      console.log("chunk recorded, attempting transcription");
      exit = await transcribe().then(async () => {
        try {
          await fs.unlink("./audio.wav");
        } catch (error) {
          console.log("Error deleting audio.wav:", error);
        }
      });
    }
    console.log("EXIT CALLED, Exiting program");
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

main();
