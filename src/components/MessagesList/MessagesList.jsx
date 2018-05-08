import React from 'react';
import { Message } from '../Message/Message';
import './messagesList.css';

export const MessagesList = ({ messages, isChat, chatUsers }) => (
  <div className="messages-list">
    {
      messages.map (
        message => {
          const user = chatUsers && chatUsers.find(user => user._id === message.userId);
          return <Message key={message.id} {...message } user={user} isChat={isChat}/>
        }
      )
    }
  </div>
);
