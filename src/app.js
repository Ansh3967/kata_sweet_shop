const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const sweetRoutes = require("./routes/sweetRouter");
app.use("/sweets", sweetRoutes);

module.exports = app;
