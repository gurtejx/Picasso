require("dotenv").config();
const express = require("express");
const api_route = require("./routes/api.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded());

app.use("/api", api_route);

app.listen(PORT, () => {
  if (!process.env.OPENAI_API_KEY) {
    console.error("No open ai api key found");
  }
  console.log(`Started listening on port ${PORT}`);
});
