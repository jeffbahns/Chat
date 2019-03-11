import React from 'react'

const userStyle = {
  borderBottom: '2px solid rgb(141, 141, 141, 50%)',
  padding: '5px 15px 5px 15px',
  margin: 0,
  textAlign: 'center'
}; 

const userStyleDark = {
  ...userStyle,
  color: 'white',
}

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
      return <div className="col-lg-12" style={this.props.themeDark ? userStyleDark : userStyle} key={index}>{user.username}</div>;
      
    });
    return (
      <div className="col-lg-3" id={this.props.themeDark ? "usersColumnDark" : "usersColumn"}>
        { users }
      </div>
    );
  }
}

export default Users;