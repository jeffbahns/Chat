import React, { Component } from "react";
import Chat from './Chat';
import './App.css';

class App extends Component {

  componentDidMount() {
    // fetch('').then(response => console.log(response));
  }
  
  componentWillUnmount() { }

  render() {
    return (
      <Chat themeDark={this.props.themeDark} />
    );
  }

} 
export default App;