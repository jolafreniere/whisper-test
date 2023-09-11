import { spawn } from "child_process";

import { runCommand } from "./commandHandler.js";
import { transcribe, transcribeCommand } from "./transcriber.js";
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
  VV;
}

let listenerId = 1;
export async function startListener(intervalInSeconds, tmpFileName) {
  let currentId = listenerId++;
  while (true) {
    const fileName = `./tmp/${tmpFileName}`;
    await recordAudio(intervalInSeconds, fileName);

    transcribe(fileName, intervalInSeconds < 5 ? ["hello", "exit"] : []).then(
      (transcribedText) => {
        // parseCommand(transcribedText);
        // console.log(`LISTENER ${currentId}: ${transcribedText}`);
      }
    );
  }
}

export async function startCommandListener(intervalInSeconds, tmpFileName) {
  let currentId = listenerId++;
  let parsePrompt = getParsePrompt();
  while (true) {
    const fileName = `./tmp/${tmpFileName}`;
    await recordAudio(intervalInSeconds, fileName);

    transcribeCommand(fileName, parsePrompt).then((transcribedText) => {
      //parseCommand(transcribedText);
      const numberRegex = /\d{1}-\d{1}-\d{1}/g;
      const match = transcribedText.match(numberRegex);
      let numbers = match[0].split("-");
      runCommand(numbers);
    });
  }
}

function getParsePrompt() {
  return "look for combinations of three numbers, like 5-1-1, 6-0-0, 4-9-3 etc, output should be three dash separated numbers like 3-1-1";
}
