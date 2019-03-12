import React from 'react'

const userStyle = {
  borderBottom: '2px solid rgb(141, 141, 141, 50%)',
  padding: '5px 15px 5px 15px',
  margin: 0,
  textAlign: 'center',
  color: 'white',
}; 

const userStyleDark = {
  ...userStyle,
  
}

const selfUserStyle = {
  color: 'white',
};

class Users extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      users: props.users
    }
  }
  
  // checks if the current message 
  isSelf = (uid) => {
    return localStorage.getItem('uid') === uid;
  }

  render() {
    
    var users = this.props.users.map((user, index) => {
      if (this.isSelf(user.uid)) {
        return (
          <div 
            className="d-none d-lg-block col-lg-12" 
            style={{...this.props.themeDark ? userStyleDark : userStyle, backgroundColor: user.color}} 
            key={index}>
              {user.username}
          </div>
        );
      }
      return (
        <div 
          className="d-none d-lg-block col-lg-12" style={{...this.props.themeDark ? userStyleDark : userStyle, backgroundColor: user.color}} 
          key={index}>{user.username}
        </div>
      );
      
    });
    return (
      <div className="col-lg-3" id={this.props.themeDark ? "usersColumnDark" : "usersColumn"}>
        { users }
      </div>
    );
  }
}

export default Users;