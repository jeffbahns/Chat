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
            messages: [],
            // users: [{username: "jeffbahns", you: true},{username: "asdfas1231"}, {username: "jeremy"}],
            users: [],
        };
    }

    componentDidMount() {
        // this.setUsername('jeffbahns');
        //todo: make this work correctly with local storage
        
        if (localStorage.getItem('username') && localStorage.getItem('username').length) {
            this.setUsername(localStorage.getItem('username'));
        }
        const { endpoint } = this.state;
        this.socket = socketIOClient(endpoint + this.state.path);
        
        this.socket.on("userLoginResponse", (data) =>  {
            this.setState({
                users: this.state.users.concat(data.users)
            });
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
            })
            
        });
        /* if (localStorage.getItem('username')) {
            this.setUsername(localStorage.getItem('username'));
        } else {
            this.setUsername('jeffbahns');
        } */
    }

    componentWillUnmount() {
        this.socket.close();
    }

    setUsername = (username, uid=null) => {
        if (username.length){
            localStorage.setItem('username', username);
            console.log(localStorage.getItem('username'));
            this.setState({ 
                username, 
                usernameSet: true,
                // users: this.state.users.concat([{username: username, uid: '', you: true}]),
            }, () => {
                this.socket.emit("userLogin", {
                    username: username
                });
            });
            
        }
    }

    onNewUser = (data) => {
        var users = this.state.users;
        console.log(data.user);
        users.push({
            username: data.user.username
        });
        this.setState({
            users,
            connectedUsers: this.state.connectedUsers+1
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
                        {/* <Col lg="3" id="usersColumn">
                            <Users users={this.state.users} />
                        </Col> */}
                        <Users users={this.state.users} />

                        <Col lg="9" id="messagesColumn">
                            <Messages messages={this.state.messages} sendMessage={this.sendMessage} />
                        </Col>
                    </Row>
                ) : (
                    <UserLogin setUsername={this.setUsername} />
                )}
            </Container> 
        );
    }
}
export default Chat;