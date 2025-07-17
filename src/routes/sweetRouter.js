const express = require("express");
const router = express.Router();
const controller = require("../controllers/sweetController");
const upload = require("../middlewares/upload.js");

router.post("/", upload.single("image"), controller.add);
router.delete("/:id", controller.remove);

module.exports = router;
