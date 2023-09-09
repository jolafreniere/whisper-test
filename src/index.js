import "dotenv/config";
import { startListener } from "./recorder.js";
import { wait } from "./utils/utils.js";

export default async function whisper() {
  console.log(process.cwd());
  startListener(10, "./longRecording.wav");
  startListener(1, "./fiveSec1.wav");
  await wait(1);
  startListener(1, "./fiveSec2.wav");
  await wait(1);
  startListener(1, "./fiveSec3.wav");
}
