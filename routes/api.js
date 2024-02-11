const express = require("express");

const router = express.Router();

router.get("/script", (req, res) => {
  return res.json({
    scripts: ["lor"],
  });
});

module.exports = router;
