import fs from "fs/promises";

export async function removeFileIfExists(filePath) {
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.log(`An error occurred while removing ${filePath}:`, error);
    }
  }
}

export async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
