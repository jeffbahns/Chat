import React, {
    Component
} from "react";
import socketIOClient from "socket.io-client";

import UserLogin from './UserLogin';
import Users from './Users';
import Messages from './Messages';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

console.log('test');

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            endpoint: "http://127.0.0.1:4001",
            path: "/general",
            username: null,
            uid: null,
            usernameSet: false,
            messages: [],
            users: [],
        };
    }

    componentDidMount() {
        const { endpoint } = this.state;
        this.socket = socketIOClient(endpoint + this.state.path);
        
        this.socket.on("userLoginResponse", (data) =>  {
            this.setState({
                user: data.user.username,
                uid: data.user.uid,
                usernameSet: true,
                users: this.state.users.concat(data.users)
            });
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('uid', data.user.uid);
        });
        
        this.socket.on("userConnect", (data) => {
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

        if (localStorage.getItem('username') && localStorage.getItem('username').length) {
            this.setUsername(localStorage.getItem('username'), localStorage.getItem('uid'));
        }
    }

    componentWillUnmount() {
        this.socket.close();
    }

    setUsername = (username, uid=null) => {
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

    sendMessage = (message, self) => {
        this.addMessage(message, self);
        this.socket.emit("newMessage", {
          message: message
        });
    }

    addMessage = (message, self) => {
        this.setState({
            // concat reverse, because of the css flex direction 'column-reverse'
            messages: [{message: message, you: self}].concat(this.state.messages)
        });
    }

    render() {
        return (
             <Container id="mainContainer">
                { this.state.usernameSet ? (
                    <Row id="mainRow">
                        <Users users={this.state.users} themeDark={this.props.themeDark} />

                        <Col lg="9" id={this.props.themeDark ? "messagesColumnDark" : "messagesColumn"}>
                            <Messages messages={this.state.messages} sendMessage={this.sendMessage} themeDark={this.props.themeDark} />
                        </Col>
                    </Row>
                ) : (
                    <UserLogin setUsername={this.setUsername} themeDark={this.props.themeDark} />
                )}
            </Container> 
        );
    }

}
export default Chat;