import React from 'react';
import './message.css';
import {Icon} from "../Icon/Icon";
import {Avatar} from "../Avatar/Avatar";

const formatOptions = {
  hour: 'numeric',
  minute: 'numeric',
};

const formatter = new Intl.DateTimeFormat('ru-RU', formatOptions)

export const Message = ({ isMy, text, status = 'sent', time, user, isChat }) => {
  const date = new Date(time);
  const timeFormatted = formatter.format(date);
  return (
    <div className={`message-wrapper ${isMy && !isChat ? 'message-wrapper_my' : ''}`}>
      {
          isChat
          ? <Avatar {...user}/>
          : false
      }
      <div className={`message ${isMy && !isChat ? 'message_my' : ''}`}>
        {
          isChat
          ? <div>{user.userName}</div>
          : false
        }
        {text}
        <span className="message__time">{timeFormatted}</span>
        <Icon type={`message-${status}`}/>
      </div>
    </div>
  );
};
