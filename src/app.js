const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const sweetRoutes = require("./routes/sweetRouter");
app.use("/sweets", sweetRoutes);

module.exports = app;
module.exports.handler = serverless(app);
