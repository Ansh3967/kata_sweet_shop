const multer = require("multer");

const storage = multer.memoryStorage(); // <-- stores file in memory

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG files allowed"));
    }
    cb(null, true);
  },
});

module.exports = upload;
