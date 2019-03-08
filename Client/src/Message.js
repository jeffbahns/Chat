import React from 'react'

const messageSentColor = 'rgb(70, 155, 242)';
const messageReceiveColor = 'rgb(228, 229, 234)';
const sentBackgroundColor = 'rgb(109,156,159,80%)';
const linkColor = 'rgb(80, 80, 255)';;
const selfLinkColor = 'rgb(240,200,255)';

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
const selfMessageStyle = {
    ...messageStyle, 
    margin: '3px 0 3px auto',
    color: 'white',
    backgroundColor: sentBackgroundColor
}

class Message extends React.Component {
    
    // checks if the current message 
    isSelf = () => {
        return localStorage.getItem('uid') === this.props.message.uid;
    }

    // takes raw text and extracts links from it
    renderText = () => {
        let reg = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        let reg2 = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        let reg3 = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        let reg4 = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

        let text = this.props.message.message.split(reg4);
        text = text.map((part, index) => index % 2 === 0 ? part : <a key={index} target="_blank" style={{color: this.isSelf() ? selfLinkColor : linkColor}} href={part}>{part}</a>);
        console.log(this.isSelf());
        return text;
    }

    render() {
        return ( 
            <div className="row">
                <div style={this.isSelf() ? selfMessageStyle : messageStyle}> 
                    {this.renderText()}
                </div> 
            </div> 
        );
    }
}

export default Message;