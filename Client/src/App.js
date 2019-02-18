import React, { Component } from "react";
import Chat from './Chat';
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount() {
    // fetch('').then(response => console.log(response));
  }
  
  componentWillUnmount() { }

  render() {
    return (
      <Chat />
    );
  }

} 
export default App;