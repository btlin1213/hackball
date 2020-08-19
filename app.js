"use strict";
const io = require("socket.io"),
  request = require("request"),
  chalk = require("chalk"),
  express = require("express");

// Init server
const PORT = process.env.PORT || 5000;
const INDEX = "/index.html";
const CLIENT_APP = "dist/app.min.js";

const app = express();
app.get("/" + CLIENT_APP, (req, res) =>
  res.sendFile(CLIENT_APP, { root: __dirname + "/client" })
);
app.use(express.static("client"));
app.get("/", (req, res) => res.sendFile(INDEX, { root: __dirname }));
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});

module.exports = io();
