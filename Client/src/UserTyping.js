import React from 'react'

const messageReceiveColor = 'rgb(228, 229, 234)';

const messageStyle = {
    padding: '0px 8px',
    width: 'fit-content',
    borderRadius: '10%',
    margin: '5px auto 5px 0',
    color: 'black',
    backgroundColor: messageReceiveColor,
    minWidth: '10px',
    maxWidth: '500px',
    wordBreak: 'break-word',
}

class UserTyping extends React.Component {

    render() {
        let users = this.props.usersTyping.reduce((string, user, i, array) => {
            if (i === 0) {
                return string + user;
            } else if (i === array.length-1) {
                return string + ' and ' + user;
            }
            return string + ', ' + user;
        }, '');
        if (this.props.usersTyping.length) {
            return (
                <div className="row">
                    <div style={messageStyle}> 
                        {users} {this.props.usersTyping.length === 1 ? 'is': 'are'} typing
                        {/* . . . . . */}
                    </div> 
                </div> 
            );
        }
        return ('');
    }
}

export default UserTyping;