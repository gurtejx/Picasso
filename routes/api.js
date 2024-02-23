const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

router.get("/script", async (req, res) => {
  const open = new OpenAI.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

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

  let gpt_msg = {}
  try {
    gpt_msg = JSON.parse(completion.choices[0].message.content)
  } catch (e) {
    return res.status(500).json({error: "Invalid GPT response"})
  }

  return res.json(gpt_msg);
});

module.exports = router;
