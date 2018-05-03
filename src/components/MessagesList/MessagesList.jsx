import React from 'react';
import { Message } from '../Message/Message';
import './messagesList.css';

export const MessagesList = ({ messages }) => (
  <div className="messages-list">
    {
      messages.map (
        message => <Message key={message.id} {...message} />
      )
    }
  </div>
);
