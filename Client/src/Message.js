import React from 'react'

const messageSentColor = 'rgb(70, 155, 242)';
const messageReceiveColor = 'rgb(228, 229, 234)';
const sentBackgroundColor = 'rgb(109,156,159,80%)';

const messageStyle = {
    padding: '0px 8px',
    width: 'fit-content',
    borderRadius: '10%',
    margin: '5px auto 5px 0',
    color: 'black',
    backgroundColor: messageReceiveColor,
    minWidth: '10px'
}
const selfMessageStyle = {
    ...messageStyle, 
    margin: '3px 0 3px auto',
    color: 'white',
    backgroundColor: sentBackgroundColor
}

const Message = (props) => {
    return ( 
        <div className="row">
            <div style={props.message.you ? selfMessageStyle : messageStyle}> 
                {props.message.message} 
            </div> 
        </div> 
    );
}

export default Message;