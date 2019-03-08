import React from "react";

class UserLogin extends React.Component {

  constructor() {
    super();
    this.state = {
      usernameInput: '',
    };
  }

  componentDidMount() {
    this.usernameInput.focus();
  }

  
  onInputChange = (event) => {
    //TODO: set min/max # of characters for name, other limits as well?
    this.setState({
      usernameInput: event.target.value
    });
  }

  onInputKeyPress = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      this.props.setUsername(this.state.usernameInput);
    }
  }

  render() {
    return (
      <div>
        <div>
          <input
            id="username" 
            value={this.state.usernameInput}
            onChange={this.onInputChange} 
            onKeyPress={this.onInputKeyPress}
            className="usernameInput"
            ref={(input) => { this.usernameInput = input; }}
            placeholder="Enter a username to enter the chat"
          ></input>
        </div>
      </div>
    );
  }
}
export default UserLogin;
