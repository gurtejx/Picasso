const express = require("express");
const api_route = require("./routes/api.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.use("/api", api_route);

app.listen(PORT, () => {
  console.log(`Started listening on port ${PORT}`);
});
