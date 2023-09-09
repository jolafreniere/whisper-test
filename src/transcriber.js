import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export async function transcribe(path, commands = []) {
  let prompt = "i'd rather you say nothing than you say something false";
  if (false /*commands.length > 0*/) {
    prompt =
      "look specifically whether one of the following words was said, but avoid false positives as much as possible, do not answer with symbols, only letters, numbers, punctuation: ";
    commands.forEach((x) => (prompt += ` ${x},`));
  }

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(path),
    model: "whisper-1",
    language: "en",
    prompt: prompt,
  });

  try {
    fs.unlink(path);
  } catch (e) {}

  return transcription.text;
  //TODO: fix gap between transcription being awaited and beginning of next audio chunk
  //TODO: use small recordings for command listening, long listening for actual chunking?
  //TODO: is the message english? else discard
}
