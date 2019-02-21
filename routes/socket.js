const socketIo = require("socket.io");
const db = require('./db');


var usersObj = {};

const getUsers = () => {
    return Object.keys(usersObj).map((user, index) => {
        return usersObj[user];
    });
};

const generateUID = () => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 15; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

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
const room = (namespace, io) => {
    var chat = io.of(namespace).on("connection", socket => {
        // socket.broadcast.emit('user-connect', {username: socket.username});
        // socket.emit('new-message', {message: `Welcome to the ${namespace} chatroom!`, username: 'Administrator'});
        console.log(socket.id);

        socket.on("connect", () => {
            console.log('* socket connected : ', socket.id);
        });

        socket.on("reconnect", () => {
            console.log(' * socket attemping reconnect : ', socket.id);
        });


        socket.on("userLogin", (user) => {
            // todo: look for inactive users, 'sleeping'

            if (user.uid && usersObj[user.uid]) { // user already logged in, same browser or whatever
                socket.username = user.username;
                socket.uid = user.uid;
                db.getMessages((messages) => {
                    socket.emit("userLoginResponse", {
                        users: getUsers(),
                        user: user,
                        messages: messages
                    }); // tell new user about others
                });
            } else {
                console.log('* * * \nreceiving for login...\n', user, '\n* * *')

                var user = {
                    ...user,
                    uid: user.uid || generateUID(user.username)
                }; // assign a user id if first login
                socket.username = user.username;
                socket.uid = user.uid;

                usersObj[socket.uid] = user;

                db.getMessages((messages) => {
                    console.log('emitting with', messages);
                    socket.emit("userLoginResponse", {
                        users: getUsers(),
                        user: user,
                        messages: messages
                    }); // tell new user about others
                });

                socket.broadcast.emit('userConnect', {
                    user: user
                }); // tell others about new user
                
                console.log('* * *\nlogged in..!\n* * *');
            }

        });


        socket.on("newMessage", (data) => {
            console.log('current user', data.uid);
            socket.broadcast.emit('newMessage', {
                ...data,
                username: socket.username
            });
            db.addMessage(data.message, data.uid);
        });


        socket.on("disconnect", () => {
            console.log('* * *\nLogging out...\n* * *')
            var deletedUser = usersObj[socket.uid];
            delete usersObj[socket.uid];
            console.log('deleted', deletedUser);
            socket.broadcast.emit('userDisconnect', {
                user: deletedUser,
                users: getUsers()
            });
        });

    });
};

module.exports.listen = (server) => {
    const io = socketIo(server);
    room('/general', io);
    return io;
};