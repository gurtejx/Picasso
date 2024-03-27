const express = require("express");
const multer = require("multer");
const OpenAI = require("openai");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

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
    console.log(completion.choices[0].message.content);
    gpt_msg = JSON.parse(completion.choices[0].message.content);
  } catch (e) {
    return res.status(500).json({ error: "Invalid GPT response" });
  }

  return res.json(gpt_msg);
});

const speechFile = path.resolve("./speech.mp3");

router.post("/speak", async (req, res) => {
  const text = req.body.text;

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

const gen_upload_fields = gen_upload.fields([
  { name: "tts", maxCount: 1 },
  { name: "vids" },
  { name: "music", maxCount: 1 },
]);
router.post("/generate", gen_upload_fields, async (req, res) => {
  // Assuming this is in the format
  // [ { sentence: "", length: 10 } ]
  const transcript = JSON.parse(req.body.transcript);

  // Sample configuration
  // const inputVideos = ["video1.mp4", "video2.mov", "video3.avi"];
  // const backgroundMusic = "music.mp3";
  const outputVideo = "combined_video.mp4";

  // Define desired video durations (in seconds)
  // const videoLengths = [5, 3, 7]; // Modify to match your desired lengths

  let command = ffmpeg();

  // Loop through videos with custom duration manipulation
  for (let i = 0; i < transcript.length; i++) {
    const video = req.files["vids"][i].path;
    const duration = transcript[i].length; // Get corresponding duration

    command = command.input(video);

    // Set video duration using 'setpts' filter with dynamic calculation
    // const divisor =
    //   duration /
    //   ffmpeg.ffprobe(video, (err, info) => {
    //     if (err) {
    //       console.error("Error:", err);
    //       return 1; // Handle potential errors, adjust as needed
    //     }
    //     return info.format.duration; // Get original video duration
    //   });
    // command = command.filter("setpts", `PTS=PTS/${divisor}`);
  }

  // Background music and remaining steps (same as previous responses)
  command = command
    // .input(backgroundMusic)
    // .audioCodec("libmp3lame")
    .complexFilter(["concat=n=" + transcript.length + ":v=1:a=1 [v] [a]"])
    .map("[v]")
    .map("[a]")
    .output(outputVideo)
    .videoCodec("libx264");

    console.log(command)
  // Error handling and execution (same as before)
  command
    .on("error", function (err) {
      console.error("Error:", err);
    })
    .on("end", function () {
      console.log("Video processing finished!");
    })
    .run();
});

module.exports = router;
