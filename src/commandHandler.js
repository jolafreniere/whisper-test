let isParsing = false;
import { say } from "./utils/say.js";
let commands = {};

async function runCommand(numbers, sayCmd = true) {
  if (numbers[0] == 4 && !isParsing) {
    // First number helps confirm a valid command
    isParsing = true;
    try {
      const code = numbers.join("");
      const command = commands[code];
      if (command) {
        if (sayCmd) say.speak(`"Running ${command.command}`);
        await command.handler();
      }
    } finally {
      await delay(1500);
      isParsing = false;
    }
  }
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function addCommand(code, command, handler) {
  if (!commands[code]) {
    commands[code] = { command, handler };
  } else {
    throw new Error(`Command ${code} already exists`);
  }
}

module.exports = {
  addCommand,
  runCommand,
};
