const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!


var users = [];

io.on("connection", socket => {

  socket.username = 'anonymous';

  socket.on("register-username", (data) => {
    let requested_username = data.username;
    
    if (users.indexOf(requested_username) > -1) { // username taken
      // console.log('username taken');
      socket.emit("username-register-failure", {response: 'Username already used'});
    } else { 
      // console.log('register username', data.username);
      socket.username = data.username;
      users.push(requested_username);
      socket.emit("username-register-success", {response: 'Username add success'});
    }
    
  });

  socket.on("get-users", () => {
    console.log(users);
  });

  socket.on("new-message", (data) => {
    io.sockets.emit('new-message', {message: data.message, username: socket.username});
  });

  socket.on("disconnect", () => console.log("Client disconnected"));



});

const getApiAndEmit = async socket => {
  let api = "https://api.darksky.net/forecast/d07d0a17f98a1feaf6a843fb9de2863d/43.7695,11.2558";
  let api2 = "http://www.spitcast.com/api/county/spots/santa-cruz/";
  try {
    const res = await axios.get(
      api2
    ); // Getting the data from DarkSky
    // console.log("FromAPI", res.data);
    socket.emit("FromAPI", res.data.length + " spots in the system"); // Emitting a new message. It will be consumed by the client

  } catch (error) {
    console.error(`Error: ${error}`);
  }
};
server.listen(port, () => console.log(`Listening on port ${port}`));