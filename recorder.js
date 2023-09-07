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
  await listen();
};

async function listen() {
  while (true) {
    await recordAudio();
    console.log("chunk recorded, attempting transcription");
    let txt = await transcribe();
    parseCommand(txt);
    try {
      await fs.unlink("./audio.wav");
    } catch (error) {
      console.log("Error deleting audio.wav:", error);
    }
  }
}

async function parseCommand(baseString) {
  let cleanValue = baseString.text.toLowerCase().trim().replace(".", "");
  if (cleanValue.indexOf("gptexit") > -1) {
    console.log("EXIT COMMAND RECEIVED, Shutting down");
    process.exit();
  }
}

main();
