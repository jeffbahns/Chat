import React from 'react'

const messageReceiveColor = 'rgb(228, 229, 234)';
const sentBackgroundColor = 'rgb(109,156,159,80%)';
const linkColor = 'rgb(80, 80, 255)';;
const selfLinkColor = 'rgb(240,200,255)';

const messageStyle = {
    padding: '0px 8px',
    width: 'fit-content',
    borderRadius: '10%',
    margin: '2px auto 2px 0',
    color: 'white',
    backgroundColor: messageReceiveColor,
    minWidth: '10px',
    maxWidth: '500px',
    wordBreak: 'break-word',
}
const selfMessageStyle = {
    ...messageStyle, 
    margin: '2px 0 2px auto',
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
        let reg4 = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
        let text = this.props.message.message.split(reg4);
        text = text.map((part, index) => index % 2 === 0 ? part : <a key={index} target="_blank" style={{color: this.isSelf() ? selfLinkColor : linkColor}} href={part}>{part}</a>);
        return text;
    }

    render() {
        return (
            this.isSelf() ? 
                <div className="row">
                    <div style={{...this.isSelf() ? selfMessageStyle : messageStyle, backgroundColor: this.props.message.color}}> 
                        {this.renderText()}
                    </div>
                </div> 
            :
                this.props.sameSender ? 
                    <div className="row">
                        <div 
                            className="row" 
                            style={{...this.isSelf() ? selfMessageStyle : messageStyle, backgroundColor: this.props.message.color}}> 
                                {this.renderText()}
                        </div> 
                    </div> 
                :
                    <div style={{marginTop: '20px'}}>
                        <div className="row" style={{color: this.props.themeDark ? 'white' : 'black'}}>
                            {this.props.message.username}
                        </div> 
                        <div className="row">
                            <div className="row" 
                                style={{...this.isSelf() ? selfMessageStyle : messageStyle, backgroundColor: this.props.message.color}}> 
                                {this.renderText()}
                            </div> 
                        </div> 
                    </div>
        );
    }
}

export default Message;