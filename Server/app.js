const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);


var users = [];

var usersObj = {
  
};

const getUserID = (username) => {
  var timestamp = new Date().getTime();
  var usercode = username.split('').map(l => l.charCodeAt(0)).reduce((ret, code) => ret + code, '');
  var combined = timestamp + usercode;
  
  // probably add in more variation, like initial socket #'s
  uid = combined;
  return uid;
};

const removeUser = (uid) => {
  var userToRemove = users.find(user => user.uid === uid);
  var index = users.indexOf(userToRemove);
  return users.splice(index, 1);
};

const room = (namespace) => {
  
  var chat = io.of(namespace).on("connection", socket => {
    // socket.broadcast.emit('user-connect', {username: socket.username});
    // socket.emit('new-message', {message: `Welcome to the ${namespace} chatroom!`, username: 'Administrator'});

    socket.on("userLogin", (user) => {
      // todo: look for inactive users, 'sleeping'

      if (user.uid && usersObj[user.uid]) { // user already logged in, same browser or whatever
        socket.emit("userLoginResponse", {users: users})
      } else {
        var user = {...user, uid: getUserID(user.username)};
        socket.username = user.username;
        socket.uid = user.uid;

        users.push(user);
        socket.emit("userLoginResponse", {users: users})
        socket.broadcast.emit('userConnect', {user: user}); // tell others about new user
      }

      
    });
  
    socket.on("newMessage", (data) => {
      socket.broadcast.emit('newMessage', {...data, username: socket.username});
    });
    
    socket.on("disconnect", () =>  {
      socket.broadcast.emit('userDisconnect', {user: removeUser(socket.uid), users: users});
    });

  });

};


// room('/admin');
room('/general');


/* io.on("connection", socket => {

  socket.username = 'anonymous';

  socket.emit('new-message', {message: 'Welcome to my chat room', username: 'Administrator'});
  socket.broadcast.emit('new-message', {message: `${socket.username} joined the room!`, username: 'Administrator'});

  

  socket.on("register-username", (data) => {
    let previous = socket.username; 
    let requested_username = data.username;

    if (users.indexOf(requested_username) > -1) { // username taken
      // console.log('username taken');
      socket.emit("username-register-failure", {response: 'Username already used'});
    } else { 
      // console.log('register username', data.username);
      socket.username = data.username;
      
      users.push(requested_username);
      
      socket.emit("username-register-success", {response: 'Username add success'});
      io.sockets.emit("new-message", {message: `${previous} changed their name to ${socket.username}`, username: 'Administrator'});
    }
    
  });

  socket.on("new-message", (data) => {
    io.sockets.emit('new-message', {message: data.message, username: socket.username});
  });
  
  socket.on("disconnect", () =>  {
    console.log("Client disconnected");
    socket.broadcast.emit('new-message', {message: 'disconnect', username: 'Administrator'});
  });

  // io.sockets.emit('hi', 'everyone');
}); */



/* const getApiAndEmit = async socket => {
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
}; */


server.listen(port, () => console.log(`Listening on port ${port}`));