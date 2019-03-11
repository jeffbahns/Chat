import React from "react";
import socketIOClient from "socket.io-client";

import UserLogin from './UserLogin';
import Users from './Users';
import Messages from './Messages';

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            path: "/general",
            username: null,
            uid: null,
            usernameSet: false,
            messages: [],
            users: [],
            usersTyping: [],
        };
    }

    componentDidMount() {
        this.socket = socketIOClient(this.state.path, {reconnection: true, forceNew: false});
        this.socket.on("disconnect", () => {
            console.log("Disconnected");
        });
          
        this.socket.on("reconnect", (data) => {
            // do not rejoin from here, since the socket.id token and/or rooms are still
            // not available.
            
            console.log("Reconnecting");
            console.log(data);
        });

        this.socket.on("connect", (data) => {
            console.log(this.loggedIn());
            // this.addMessage('hello test');
            // if (this.loggedIn()) {
            //     this.socket.emit('connect');
            // }
        });

        this.socket.on("userLoginResponse", (data) =>  {
            this.setState({
                user: data.user.username,
                uid: data.user.uid,
                usernameSet: true,
                users: this.state.users.concat(data.users),
                messages: data.messages,
            });

            // could be redundant
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('uid', data.user.uid);
        });
        
        this.socket.on("userConnect", (data) => {
            if (data.user.uid === this.state.uid) { return ; }
            this.setState({
                users: this.state.users.concat([data.user])
            });
        });

        this.socket.on("userDisconnect", (data) => {
            this.setState({
                users: data.users
            });
        });

        this.socket.on("newMessage", (message) => {
            this.setState({
                messages: [message].concat(this.state.messages)
            });
        });

        this.socket.on("userTyping", (data) => {
            if (data.uid === this.state.uid) { return; }
            this.setState({
                usersTyping: this.state.usersTyping.concat([data.username])
            });
        });

        this.socket.on("userStoppedTyping", (data) => {
            if (data.uid === this.state.uid) { return; }
            this.setState({
                usersTyping: this.state.usersTyping.filter(user => user != data.username)
            });
        });

        if (localStorage.getItem('username') && localStorage.getItem('username').length) {
            
            this.setUsername(localStorage.getItem('username'), localStorage.getItem('uid'));
        }
    }

    componentWillUnmount() {
        this.socket.close();
    }

    loggedIn = () => {
        return localStorage.getItem('username') && localStorage.getItem('username').length > 0;
    }

    setUsername = (username, uid = null) => {
        this.socket.emit("userLogin", {
            username: username,
            uid: uid
        });
    }

    onNewUser = (data) => {
        var users = this.state.users;
        users.push({
            username: data.user.username
        });
        this.setState({
            users: users.concat([{
                username: data.user.username,
                uid: data.user.uid
            }]),
        });
    }

    sendMessage = (message) => {
        this.addMessage(message);
        this.socket.emit("newMessage", {
          message: message,
          uid: this.state.uid,
        });
    }

    addMessage = (message) => {
        this.setState({
            // concat reverse, because of the css flex direction 'column-reverse'
            messages: [{message: message, uid: this.state.uid}].concat(this.state.messages)
        });
    }

    userTyping = (isTyping) => {
        if (isTyping) {
            this.socket.emit('userTyping');
        } else {
            this.socket.emit('userStoppedTyping');
        }
    }

    render() {
        return (
             <div className="container" id="mainContainer">
                { this.state.usernameSet ? (
                    <div className="row" id="mainRow">
                        <Users users={this.state.users} themeDark={this.props.themeDark} />

                        <div className="col col-lg-9"id={this.props.themeDark ? "messagesColumnDark" : "messagesColumn"}>
                            <Messages 
                                messages={this.state.messages} 
                                sendMessage={this.sendMessage} 
                                themeDark={this.props.themeDark}
                                userTyping={this.userTyping}
                                usersTyping={this.state.usersTyping}
                            />
                        </div>
                    </div>
                ) : (
                    <UserLogin setUsername={this.setUsername} themeDark={this.props.themeDark} />
                )}
            </div> 
        );
    }
}

export default Chat;