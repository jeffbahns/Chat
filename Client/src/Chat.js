import React from "react";
import socketIOClient from "socket.io-client";

import UserLogin from './UserLogin';
import Users from './Users';
import Messages from './Messages';

import {
    userLoginResponse,
    disconnect, 
    reconnect,
    connect,
    userConnect,
    userDisconnect,
    newMessage,
    userTypingResponse,
    userStoppedTyping,
} from './socketAPI';

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
        
        this.disconnect = disconnect.bind(this);
        this.reconnect = reconnect.bind(this);
        this.connect = connect.bind(this);
        this.userLoginResponse = userLoginResponse.bind(this);
        this.userConnect = userConnect.bind(this);
        this.userDisconnect = userDisconnect.bind(this)
        this.newMessage = newMessage.bind(this);
        this.userTypingResponse = userTypingResponse.bind(this);
        this.userStoppedTyping = userStoppedTyping.bind(this);
    }

    componentDidMount() {
        this.socket = socketIOClient(this.state.path, {
            reconnection: true, 
            forceNew: false
        });
        
        this.socket.on("disconnect", this.disconnect);
        this.socket.on("reconnect", this.reconnect);
        this.socket.on("connect", this.connect);
        this.socket.on("userLoginResponse", this.userLoginResponse);
        this.socket.on("userConnect", this.userConnect);
        this.socket.on("userDisconnect", this.userDisconnect);
        this.socket.on("newMessage", this.newMessage);
        this.socket.on("userTyping", this.userTypingResponse);
        this.socket.on("userStoppedTyping", this.userStoppedTyping);

        if (localStorage.getItem('username') && localStorage.getItem('username').length) {
            this.login(localStorage.getItem('username'), localStorage.getItem('uid'));
        }
    }

    componentWillUnmount() {
        this.socket.close();
    }

    loggedIn = () => {
        return localStorage.getItem('username') && localStorage.getItem('username').length > 0;
    }

    login = (username, uid = null) => {
        console.log()
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
                    <UserLogin setUsername={this.login} themeDark={this.props.themeDark} />
                )}
            </div> 
        );
    }
}

export default Chat;