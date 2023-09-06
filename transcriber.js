import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export async function transcribe() {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream("audio.wav"),
    model: "whisper-1",
  });

  let cleanValue = transcription.text.toLowerCase().trim().replace(".", "");

  if (cleanValue == "gptexit") {
    console.log("EXIT COMMAND RECEIVED, Shutting down");
    process.exit();
  }
  //TODO: proper command handling
  //TODO: fix gap between transcription being awaited and beginning of next audio chunk
  //TODO: use small recordings for command listening, long listening for actual chunking?
}
