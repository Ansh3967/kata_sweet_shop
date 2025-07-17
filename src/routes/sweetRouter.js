const express = require("express");
const router = express.Router();
const controller = require("../controllers/sweetController");
const upload = require("../middlewares/upload.js");

router.post("/", upload.single("image"), controller.add);

module.exports = router;
