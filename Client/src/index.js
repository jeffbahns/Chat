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
const routing = (
    <Router>
        <div>
            <Navbar style={navStyle} collapseOnSelect>
                <Navbar.Brand style={{color: 'white', padding: '0px 6px', margin: 0,border: '1px solid white' }}>livechat</Navbar.Brand>
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
                <Route exact path="/" component={App} />
                {/* <Route path="/general" component={Chat} />
                <Route path="/admin" component={Chat} />
                <Route path="/users/5" component={Users} />
                <Route path="/about" component={About} /> */}
                <Route component={NotFound} />
            </Switch>
        </div>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
