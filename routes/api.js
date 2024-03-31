const express = require("express");
const multer = require("multer");
const OpenAI = require("openai");
const path = require("path");
const fs = require("fs");
const pexels = require("pexels");

const router = express.Router();

const tts_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tts/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});
const tts_upload = multer({ storage: tts_storage });
const gen_upload = multer({ dest: "./tts" });

const open = new OpenAI.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const client = pexels.createClient(process.env.API_KEY);

router.get("/script", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  console.log("/script was called");
  const topic = req.query.topic;
  if (!topic) {
    return res.status(400).json({ error: "No topic provided" });
  }

  const completion = await open.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `Generate a 100 word youtube video scripts on the following topic: ${topic}. Split it into sentences
        and give one image/video keyword related to the sentence.
        Remember this is for a vertical short form video. Always have a good intro
        and make sure it flows well. Please reply in a proper JSON format.
        ONLY GIVE PARSEABLE JSON, NOTHING ELSE, NO CODE BLOCKS EVEN
        Make sure the json is like this: {title: "", content: [
          {
            sentence: "...",
            image_search_keyword: "..."
          },
          {
            sentence: "...",
            image_search_keyword: "..."
          }
         ]}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  let gpt_msg = {};
  try {
    gpt_msg = JSON.parse(completion.choices[0].message.content);
    console.log(gpt_msg)
  } catch (e) {
    return res.status(500).json({ error: "Invalid GPT response" });
  }

  return res.json(gpt_msg);
});

const speechFile = path.resolve("./speech.mp3");

router.post("/speak", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  console.log("was called");
  console.log(req.body)
  const text = req.body.text;
  // console.log(text)

  const mp3 = await open.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);

  return res.sendFile(path.resolve("./speech.mp3"));
});

router.post("/transcribe", tts_upload.single("tts"), async (req, res) => {
  const transcription = await open.audio.transcriptions.create({
    file: fs.createReadStream(req.file.path),
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });

  return res.json(transcription);
});

router.get("/stock_vid", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  console.log('called')
  const topic = req.query.topic;

  const vids = await client.videos.search({
    query: topic,
    per_page: 1,
    max_duration: 30,
    min_width: 1920,
    max_width: 1920,
  });
  const vid_files = vids.videos[0].video_files;

  res.json({ url: vid_files[vid_files.length - 1] });
});

const gen_upload_fields = gen_upload.fields([
  { name: "tts", maxCount: 1 },
  { name: "vids" },
  { name: "music", maxCount: 1 },
]);
router.post("/generate", gen_upload_fields, async (req, res) => {});

module.exports = router;
