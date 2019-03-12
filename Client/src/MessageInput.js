import React from 'react'

const WAIT_INTERVAL = 2000;
const ENTER_KEY = 13;

const BORDER_COLOR = '2px solid rgb(141, 141, 141, 50%)';

const inputStyle = {
  height: '100%',
  width: '100%',
  padding: '0% 2% 0% 2%',
  border: 'none',
};

const inputStyleDark = {
  height: '100%',
  width: '100%',
  padding: '0% 2% 0% 2%',
  border: 'none',
  backgroundColor: 'rgb(63,63,63)',
  color: 'white',
};

const messageInputStyle = {
  position: 'absolute',
  bottom: '0',
  width: '100%',
  borderTop: BORDER_COLOR,
  // height: 'fit-content',
  height: '5%',
  margin: 0,
};

class MessageInput extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      typing: false,
    }
    this.userTypingTimeout = this.userTypingTimeout.bind(this);

  }

  componentWillMount() {
    this.timer = null;
  }

  componentDidMount() {
      this.textInput.focus();
  }

  userTypingTimeout(userTyping) {//, setState) {
    
    // this.props.userTyping(false);
    userTyping(false);
    this.setState({typing: false});
  }

  onMessageChange = (event) => {
    
    if (this.state.typing) {
      clearTimeout(this.timer);
    } else {
      this.props.userTyping(true);
      this.setState({ typing: true });
    }
    this.timer = setTimeout(this.userTypingTimeout, WAIT_INTERVAL, this.props.userTyping);

    this.setState({
      message: event.target.value
    });
    
    // this.timer = setTimeout(this.props.userTyping(),  WAIT_INTERVAL);
  }

  onMessageKeyUp = (event) => {
    var code = event.keyCode || event.which;
    if (code === ENTER_KEY && this.state.message.length) {
      clearTimeout(this.timer);
      this.userTypingTimeout(this.props.userTyping);

      this.props.sendMessage(this.state.message);
      this.setState({ message: '' });
    }
  }

  onSubmitClick = () => {
    if (this.state.message.length) {
      this.props.sendMessage(this.state.message, true);
      this.setState({ message: '' });
    }
    this.textInput.focus();
  }

  render() {
    return (
      <div className="row" style={messageInputStyle}>
        <div className="col-lg-10 col-10" style={{padding: 0}}>
          <input
            style={this.props.themeDark ? inputStyleDark : inputStyle}
            value={this.state.message}
            onChange={this.onMessageChange}
            onKeyUp={this.onMessageKeyUp}
            ref={(input) => { this.textInput = input; }}
            id="username" placeholder="Message" 
          ></input>
        </div>
        <div className="col-lg-2 col-2" style={{borderLeft: BORDER_COLOR, padding: 0}}>
          <button  style={{backgroundColor: 'rgb(109,200,159,80%)', color: 'white',border: 'none', width: '100%', height: '100%'}} 
            onClick={this.onSubmitClick}>
            <b>
              Send
            </b>
          </button>
        </div>
        
        
      </div>
        
          
    );
  }
  
}

export default MessageInput;