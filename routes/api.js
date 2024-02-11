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
        content: `Give a 100 word youtube video script on the following topic: ${topic}.`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log(completion);

  return res.json({
    scripts: ["lor"],
  });
});

module.exports = router;
