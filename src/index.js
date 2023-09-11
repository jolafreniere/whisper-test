import "dotenv/config";
import { existsSync, mkdirSync } from "fs";
import { addCommand } from "./commandHandler.js";
import { startCommandListener, startListener } from "./recorder.js";
import { say } from "./utils/say.js";
import { wait } from "./utils/utils.js";
export async function whisper() {
  if (!existsSync("./tmp")) {
    mkdirSync("./tmp", { recursive: true });
  }
  registerCommands();
  startListener(10, "./longRecording.wav");
  startCommandListener(2, "./fiveSec1.wav");
  await wait(1);
  startCommandListener(2, "./fiveSec2.wav");
}

function registerCommands() {
  registerCommand("404", "exit", async () => {
    process.exit(0);
  });
}
export function registerCommand(code, name, handler) {
  addCommand(code, name, handler);
}
