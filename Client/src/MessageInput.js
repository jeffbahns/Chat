import React from 'react'

const inputStyle = {
  height: '100%',
  width: '100%',
  padding: '0% 2% 0% 2%',
  borderTop: '2px solid rgb(141, 141, 141, 50%)',
  borderLeft: 'none'
};

const messageInputStyle = {
  position: 'absolute',
  bottom: '0',
  width: '100%',
  height: '5%',
  margin: 0,
};

class MessageInput extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    }
  }

  componentDidMount() {
      this.textInput.focus();
  }

  onMessageChange = (event) => {
    this.setState({
      message: event.target.value
    });
  }

  onMessageKeyUp = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13 && this.state.message.length) {
      this.props.sendMessage(this.state.message, true);
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
        <div className="col-lg-10" style={{padding: 0}}>
          <input
            style={inputStyle}
            value={this.state.message}
            onChange={this.onMessageChange}
            onKeyUp={this.onMessageKeyUp}
            ref={(input) => { this.textInput = input; }}
            id="username" placeholder="Message" 
          ></input>
        </div>
        <div className="col-lg-2" style={{borderTop: '2px solid rgb(141, 141, 141, 50%)', padding: 0}}>
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