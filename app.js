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

// var mysql = require('mysql');
//First you need to create a connection to the db
// const con = mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_DATABASE,
//     debug: false
// });

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

const p = (printthis) => {
  console.log(printthis);
}
const room = (namespace) => {
  
  var chat = io.of(namespace).on("connection", socket => {
    // socket.broadcast.emit('user-connect', {username: socket.username});
    // socket.emit('new-message', {message: `Welcome to the ${namespace} chatroom!`, username: 'Administrator'});

    socket.on("userLogin", (user) => {
      // todo: look for inactive users, 'sleeping'

      if (user.uid && usersObj[user.uid]) { // user already logged in, same browser or whatever
        socket.emit("userLoginResponse", {users: users});
      } else {
        p('receiving for login...')
        p(user);
        var user = {...user, uid: user.uid || getUserID(user.username)}; // assign a user id if first login
        socket.username = user.username;
        socket.uid = user.uid;

        users.push(user);
        socket.emit("userLoginResponse", {users: users, user: user})
        socket.broadcast.emit('userConnect', {user: user}); // tell others about new user
        console.log('logging in...');
        console.log(user);
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

room('/general');

server.listen(port, () => console.log(`Listening on port ${port}`));