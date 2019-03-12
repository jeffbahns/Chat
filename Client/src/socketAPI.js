

/* Client-side event handlers for SocketIO */

export function userLoginResponse(data) {
    console.log('logging in..');
    // console.log(data);
    this.setState({
        user: data.user.username,
        uid: data.user.uid,
        color: data.user.color,
        usernameSet: true,
        users: this.state.users.concat(data.users),
        messages: data.messages,
    });

    // could be redundant
    localStorage.setItem('username', data.user.username);
    localStorage.setItem('uid', data.user.uid);
};

export function disconnect(data) {
    console.log("Disconnected");
}

export function reconnect(data) {
    // do not rejoin from here, since the socket.id token and/or rooms are still
    // not available.
    
    console.log("Attempting reconnect");
    this.socket.emit('attemptReconnect', {
        username: localStorage.getItem('username'),
        uid: localStorage.getItem('uid'),
        color: this.state.color
    });
}

export function reconnectResponse(data) {
    console.log('successful reconnect')
    
    this.setState({
        users: data.users
    });
}

export function connect(data) {
    console.log(this.loggedIn());
    // this.addMessage('hello test');
    // if (this.loggedIn()) {
    //     this.socket.emit('connect');
    // }
}

export function userConnect(data) {
    if (data.user.uid === this.state.uid) { return ; }
    console.log(data);
    this.setState({
        users: this.state.users.concat([data.user])
    });
}

export function userDisconnect(data) {
    this.setState({
        users: data.users
    });
}

export function newMessage(message) {
    this.setState({
        messages: [message].concat(this.state.messages)
    });
}

export function userTypingResponse(data) {
    console.log('user typing' + data);
    if (data.uid === this.state.uid) { return; }
    this.setState({
        usersTyping: this.state.usersTyping.concat([data.username])
    });
}

export function userStoppedTyping(data) {
    if (data.uid === this.state.uid) { return; }
    this.setState({
        usersTyping: this.state.usersTyping.filter(user => user != data.username)
    });
}

