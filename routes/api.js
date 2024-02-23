const express = require("express");
const OpenAI = require("openai");
const path = require("path")
const fs = require("fs")

const router = express.Router();

const open = new OpenAI.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.get("/script", async (req, res) => {
  const topic = req.query.topic;
  if (!topic) {
    return res.status(400).json({ error: "No topic provided" });
  }

  const completion = await open.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `Generate a 100 word youtube video scripts on the following topic: ${topic}. Please reply in a proper JSON format. Make sure the json is like this: {title: "", content: ""}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  let gpt_msg = {};
  try {
    gpt_msg = JSON.parse(completion.choices[0].message.content);
  } catch (e) {
    return res.status(500).json({ error: "Invalid GPT response" });
  }

  return res.json(gpt_msg);
});

const speechFile = path.resolve("./speech.mp3");

router.post("/speak", async (req, res) => {
  const text = req.body.text

  const mp3 = await open.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);

  return res.sendFile(path.resolve("./speech.mp3"))
});

module.exports = router;
