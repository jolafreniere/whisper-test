import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export async function transcribe(path, prompt) {
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

export async function transcribeCommand(path, prompt) {
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
