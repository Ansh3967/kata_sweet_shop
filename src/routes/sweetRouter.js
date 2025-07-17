const express = require("express");
const router = express.Router();
const controller = require("../controllers/sweetController");
const upload = require("../middlewares/upload.js");

router.post("/", controller.add);
router.get("/", controller.list);
router.get("/search", controller.searchSweets);
router.get("/:id", controller.get);
router.put("/:id", controller.edit);
router.delete("/:id", controller.remove);
router.post("/:id/purchase", controller.purchaseSweet);
router.post("/:id/restock", controller.restockSweet);

module.exports = router;
