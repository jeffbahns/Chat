import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import MessageInput from './MessageInput';
import Message from './Message';

const messagesStyle = {
  // position: 'absolute',
  width: '100%',
  height: '95%',
  // bottom: '5%',
  overflowY: 'scroll',
  margin: 0,
  padding: '0px 20px 0px 20px',
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
      <Row style={{height: '100%', margin: 0, padding: 0}}>
        <Row style={messagesStyle}>
          <Col style={{minHeight: 'min-content', display: 'flex', flexDirection: 'column-reverse'}}>
            { messages }
          </Col>
        </Row>

        <MessageInput sendMessage={this.props.sendMessage} />
        
        {/* {<button onClick={this.onMessageSend}>Submit</button>} */}
        
      </Row>
    );

  }

}

export default Messages;