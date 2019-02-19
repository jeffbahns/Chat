import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';

import './index.css';

import App from './App';
import NotFound from './NotFound';
import Navbar from 'react-bootstrap/Navbar';

import * as serviceWorker from './serviceWorker';

const navStyle = {
    height: '5vh',
    backgroundColor: 'rgb(109,156,159,80%)',
    color: 'white',
    borderBottom: '2px solid rgb(109,156,159,100%)'
};
const navStyleDark = {
    ...navStyle,
    backgroundColor: 'rgb(80,80,80,80%)',
};
class Routing extends React.Component {
    constructor() {
        super();
        this.state = {
            themeDark: localStorage.getItem('themeDark') && localStorage.getItem('themeDark') == 0 ? 0 : 1
        }
    }

    toggleTheme = () => { 
        this.setState({
            themeDark : this.state.themeDark ? 0 : 1
        }, () => {
            localStorage.setItem('themeDark', this.state.themeDark);
        });
    }

    render() {
        return (
            <Router>
                <div>
                    <Navbar style={this.state.themeDark ? navStyleDark : navStyle} collapseOnSelect>
                        <Navbar.Brand 
                            style={{color: 'white', padding: '0px 6px', margin: 0,border: '1px solid white' }}
                            onClick={() => this.toggleTheme()}
                        >
                            livechat : {this.state.themeDark ? 'dark' : 'light'}
                        </Navbar.Brand>
                        
                        {/* <Nav className="mr-auto">
                            <Nav.Link href="/general">General</Nav.Link>
                            <Nav.Link href="/admin">Admin</Nav.Link>
                            <Nav.Link href="/users/5">Contact</Nav.Link>
                            <Nav.Link href="/about">About</Nav.Link>
                        </Nav> */}
                        
                        {/* { localStorage.username && localStorage.username.length ? (
                            <Navbar.Collapse style={{}} className="justify-content-end">
                                <Navbar.Text>
                                    Signed in as: <a>{localStorage.username}</a>
                                </Navbar.Text>
                                <Navbar.Text>
                                    <button onClick={() => localStorage.setItem('username', '')}>Logout</button>
                                </Navbar.Text>
                            </Navbar.Collapse>
                        ) : (
                            ''
                        )} */}
                        

                        {/* TODO: putting username into header */}
                    </Navbar>
                    <Switch>
                        <Route 
                            exact path="/" 
                            render={(props) => <App {...props} themeDark={this.state.themeDark} />} 
                        />
                        {/* // <Route path="/users/5" component={Users} /> */}
                        {/* // <Route path="/about" component={About} /> */}
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<Routing/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
