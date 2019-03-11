import React from 'react'

import MessageInput from './MessageInput';
import Message from './Message';
import UserTyping from './UserTyping';

const messagesStyle = {
  // position: 'absolute',
  width: '100%',
  height: '95%',
  // bottom: '5%',
  overflowY: 'scroll',
  margin: 0,
  padding: '10px 20px',
  display: 'flex',
  flexDirection: 'column-reverse',
};


class Messages extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      messages: props.messages
    }
  }

  render() {
    var messages = this.props.messages.map((message, index, messages) => {
      return <Message key={index} message={message} sameSender={index > 0 && messages[index].username === messages[index-1].username} />;
    });
    return (
      <div className="row" style={{height: '95vh', margin: 0, padding: 0}}>
        <div className="row" style={messagesStyle}>
          <div className="col" style={{minHeight: 'min-content', display: 'flex', flexDirection: 'column-reverse'}}>
            <UserTyping usersTyping={this.props.usersTyping} />
            { messages }
          </div>
          
          
        </div>
        <MessageInput 
          sendMessage={this.props.sendMessage} 
          themeDark={this.props.themeDark} 
          userTyping={this.props.userTyping}
        />
        
        {/* {<button onClick={this.onMessageSend}>Submit</button>} */}
        
      </div>
    );

  }

}

export default Messages;