const express = require("express");
const router = express.Router();
const controller = require("../controllers/sweetController");
const upload = require("../middlewares/upload.js");

router.post("/", upload.single("image"), controller.add);
router.get("/", controller.list);
router.get("/:id", controller.get);
router.put("/:id", upload.single("image"), controller.edit);
router.delete("/:id", controller.remove);
router.get("/search", controller.searchSweets);
router.post("/:id/purchase", controller.purchaseSweet);

module.exports = router;
