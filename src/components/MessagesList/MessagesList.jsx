import React from 'react';
import { Message } from '../Message/Message';
import './messagesList.css';

export const MessagesList = ({ messages, isChat, chatUsers }) => (
  <div className="messages-list">
    {
      messages.map (
        message => {
          let user;
          if (isChat && chatUsers.length) {
            const currentUser = chatUsers.find(user => user._id === message.userId);
            user = chatUsers && currentUser;
            user.color = `${chatUsers.indexOf(currentUser)}`;
          }
          return <Message key={message.id} {...message } user={user} isChat={isChat}/>
        }
      )
    }
  </div>
);
