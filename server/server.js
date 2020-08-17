"use strict";
const io = require("socket.io")
    , request = require("request")
    , chalk = require("chalk")
    , express = require("express");

// Get global ip
let ip = null;
request("https://diagnostic.opendns.com/myip", (err, data) =>ip = data.body);

// Try register in global server
setInterval(() => {
  ip && request.post({url: "https://hackball-global.herokuapp.com/list", form: {ip}});
}, 2000);

// Init server
const PORT = process.env.PORT || 5000
const app = express()
app.listen(PORT, () => {console.log(`Listening at port ${PORT}`)})

module.exports = io.listen(3000);