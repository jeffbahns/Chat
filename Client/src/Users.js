import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const userStyle = {
  borderBottom: '2px solid rgb(141, 141, 141, 50%)',
  padding: '5px 15px 5px 15px',
  margin: 0,
  textAlign: 'center'
}; 

const selfUserStyle = {
  color: 'blue',
};

class Users extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      users: props.users
    }
  }

  render() {
    var users = this.props.users.map((user, index) => {
      if (user.you) {
        return <div style={selfUserStyle} key={index}>{user.username}</div>;
      }
      return <div className="col-lg-12" style={userStyle} key={index}>{user.username}</div>;
      
    });
    return (
      <div className="col-lg-3" id="usersColumn">
        { users }
      </div>
    );
  }
}

export default Users;