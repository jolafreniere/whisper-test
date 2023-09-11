import "dotenv/config";
import fs from "fs";
import OpenAI from "openai";
//models are gpt-3.5-turbo, gpt-3.5-turbo-16k, gpt-4, gpt-4-32k

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const models = {
  gpt35: "gpt-3.5-turbo",
  gpt35x: "gpt-3.5-turbo-16k",
  gpt4: "gpt-4",
  gpt4x: "gpt-4-32k",
};

export async function createCompletion(
  userMessage,
  model = models.gpt35,
  max_tokens = 1000, //TODO: CREATE PROPER CONFIGURATION, MAGIC NUMBER
  n = 1, //number of answers
  temperature = 0.7
) {
  if (userMessage == "") throw new Error("Message cannot be null");
  const payload = {
    model,
    max_tokens,
    n,
    temperature,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  };

  const completion = await openai.chat.completions.create(payload);
  return completion.choices;
}
