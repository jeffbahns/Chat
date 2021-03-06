const socketIo = require("socket.io");
const db = require('./db');


var users = {};

/*
User of users model = {
    username: '',
    uid: '',
    color: '',
    sockets: []
}
*/

// maps the users object to an array which is more suitable client-side
const getUsers = () => {
    return Object.keys(users).map((user, index) => {
        return users[user];
    });
};

// generates unique user id
const generateUID = () => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 15; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// used to assign colors for users
const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  

const room = (namespace, io) => {
    var chat = io.of(namespace).on("connection", socket => {
        console.log('initial connection', socket.id);

        // socket.on("connect", () => { // probably not necessary, redundant?
        //     console.log('* socket connected : ', socket.id);
        // });

        socket.on("attemptReconnect", (user) => {
            console.log(' * socket attemping reconnect : ', socket.id);
            
            socket.username = user.username;
            socket.uid = user.uid;

            
            if (user.uid && users[user.uid]) {
                users[user.uid].sockets.push(socket.id);
            } else {
                users[user.uid] = {
                    ...user,
                    sockets: [socket.id]
                };
                socket.broadcast.emit('userConnect', {
                    user: users[socket.uid]
                }); // tell others about new user
            }

            db.getMessages((messages) => {
                socket.emit("reconnectResponse", {
                    users: getUsers(),
                    user: users[user.uid],
                    messages: messages
                }); // tell new user about others
            });
        });


        socket.on("userLogin", (user) => {
            // todo: look for inactive users, 'sleeping'

            if (user.uid && users[user.uid]) { // user already logged in, same browser or whatever
                socket.username = user.username;
                socket.uid = user.uid;
                users[user.uid].sockets.push(socket.id); 
                
                db.getMessages((messages) => {
                    socket.emit("userLoginResponse", {
                        users: getUsers(),
                        user: users[user.uid],
                        messages: messages
                    }); // tell new user about others
                });
            } else {
                console.log('* * * \nreceiving for login...\n', user, '\n* * *')

                var user = {
                    ...user,
                    uid: user.uid || generateUID(user.username),
                    color: getRandomColor(),
                    sockets: [socket.id]
                }; // assign a user id if first login
                socket.username = user.username;
                socket.uid = user.uid;
                users[socket.uid] = user;

                db.getMessages((messages) => {
                    console.log(user, user.color);
                    socket.emit("userLoginResponse", {
                        users: getUsers(),
                        user: user,
                        messages: messages
                    }); // tell new user about others
                });

                socket.broadcast.emit('userConnect', {
                    user: users[socket.uid]
                }); // tell others about new user
                
                console.log('* * *\nlogged in..!\n* * *');
            }
            

        });

        socket.on("newMessage", (data) => {
            console.log(`message from ${data.uid} at socket: ${socket.id}`);
            socket.broadcast.emit('newMessage', {
                ...data,
                username: socket.username,
                color: users[socket.uid].color,
            });
            db.addMessage(data.message, data.uid);
        });

        socket.on("userTyping", () => {
            console.log('user typing');
            socket.broadcast.emit("userTyping", {
                username: socket.username,
                uid: socket.uid
            });
        });

        socket.on("userStoppedTyping", () => {
            console.log('user stopped typing');
            socket.broadcast.emit("userStoppedTyping", {
                username: socket.username
            });
        });


        socket.on("disconnect", () => {
            console.log('* * *\nLogging out...\n* * *')
            
            // remove socket but not necessarily user, user could be connected via multiple sockets (tabs, windows)
            var user = users[socket.uid];
            if (!user)  { return ; } // could be scenarios when server restarts, etc

            if (user.sockets.length > 1) { // multiple connections, do not remove user
                user.sockets.splice(user.sockets.indexOf(socket.id), 1);
                console.log(`user: ${socket.id} has sockets: `, user.sockets.filter(socket => socket != socket.id));
                return ;
            }
            
            delete users[socket.uid];
            socket.broadcast.emit('userDisconnect', {
                user: user,
                users: getUsers(),
            });
            
        });

    });
};

module.exports.listen = (server) => {
    const io = socketIo(server);
    room('/general', io);
    return io;
};