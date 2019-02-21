const dotenv = require('dotenv').config();
const express = require("express");
const http = require("http");

const axios = require("axios");
const port = process.env.PORT || 4001;

const index = require("./routes/index");
const socket = require("./routes/socket");

const app = express();
app.use(index);

const server = http.createServer(app);
io = socket.listen(server);
const path = require('path');
var mysql = require('mysql');




// only for production, will fuck up dev
// // Serve static files from the React frontend app
// app.use(express.static(path.join(__dirname, 'Client/build')))

// // Anything that doesn't match the above, send back index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/Client/build/index.html'))
// })



server.listen(port, () => console.log(`Listening on port ${port}`));