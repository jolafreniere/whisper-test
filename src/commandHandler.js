let isParsing = false;

let commands = {};

async function runCommand(numbers, say = true) {
  if (numbers[0] == 4 && !isParsing) {
    // First number helps confirm a valid command
    isParsing = true;
    try {
      const code = numbers.join("");
      const command = commands[code];
      if (command) {
        if (say) say.speak(`"Running ${command.command}`);
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
