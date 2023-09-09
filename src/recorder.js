import { spawn } from "child_process";
import path from "path";
import say from "say";
import { transcribe } from "./transcriber.js";
import { removeFileIfExists } from "./utils/utils.js";
export async function recordAudio(durationSeconds, outputFileName) {
  await removeFileIfExists(outputFileName);
  return new Promise((resolve, reject) => {
    //TODO: this is pretty dangerous, this feeds straight into the command line

    const ffmpeg = spawn(
      `C:\\ffmpeg\\ffmpeg.exe -f dshow -i audio="Microphone (3- USB PnP Audio Device)" -t ${durationSeconds} ${outputFileName}`,
      { shell: true }
    );
    ffmpeg.on("close", (code) => {
      if (code !== 0) {
        console.log(`FFmpeg exited with code ${code}`);
        console.log(outputFileName);
        console.log(`CWD: ${process.cwd()}`);
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
      resolve();
    });

    ffmpeg.on("error", (error) => {
      console.log("An error occurred:", error);
      reject(error);
    });
  });
}

let listenerId = 1;
export async function startListener(intervalInSeconds, tmpFileName) {
  let currentId = listenerId++;
  while (true) {
    const fileName = path.join(__dirname, "tmp", tmpFileName);
    await recordAudio(intervalInSeconds, fileName);

    transcribe(fileName, intervalInSeconds < 5 ? ["hello", "exit"] : []).then(
      (transcribedText) => {
        parseCommand(transcribedText);
        console.log(`LISTENER ${currentId}: ${transcribedText}`);
      }
    );
  }
}

async function parseCommand(baseString) {
  const cleanValue = baseString.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  // Regex pattern to match the keywords "hello" and "exit"
  const keywordPattern = /\b(hello|exit)\b/g;

  // Find matches
  const matches = cleanValue.match(keywordPattern);

  if (matches) {
    matches.forEach((match) => {
      switch (match) {
        case "hello":
          console.log("you said hello");
          break;
        case "exit":
          say.speak("Exiting Program");
          console.log("EXITING PROGRAM");
          process.exit();
          break;
      }
    });
  }
}
