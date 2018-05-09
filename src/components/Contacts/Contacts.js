import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Contact } from '../Contact/Contact';
import api from '../../api';

import './Contacts.css';

class ContactsComponent extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
    };
  }

  getChatId = contact => async e => {
    const currentUserId = this.props.user._id;
    const roomMembers = [currentUserId, contact._id].sort().toString();
    try {
      const rooms = await api.getRooms({ name: roomMembers });
      if (!rooms.count) {
        this.createRoomWithUser(roomMembers, contact._id);
      } else {
        this.props.history.push(`/chat/${rooms.items[0]._id}`);
      }
    } catch (err) {
      this.setState({ error: 'Произошла ошибка.' });
    }
  };

  createRoomWithUser = async (name, userId) => {
    try {
      const room = await api.createRoom({ name });
      await this.joinUserToRoom(userId, room._id);      
      this.props.history.push(`/chat/${room._id}`);
    } catch (err) {
      this.setState({ error: 'Произошла при создании комнаты.' });
    }
  };

  joinUserToRoom = async (userId, roomId) => {
    try {
      await api.userJoinRoom(userId, roomId);
    } catch (err) {
      this.setState({ error: 'Произошла ошибка при создании комнаты.' });
    }
  };

  render() {
    const {contacts, search, addToChat, createChat, user} = this.props;
    return (
      <React.Fragment>
        <div className="contacts">
          {contacts.map((contact, index) => {
            const props = {};
            if (user) {
              props.onClick = createChat
                              ? () => addToChat(contact)
                              : this.getChatId(contact);
            } else {
              props.link = `/chat/${contact._id}`;
            }
            if (contact.name.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
              return <Contact key={index} color={`${index}`} {...props} {...contact} />;
            }
            return null;
          })}
          {this.state.error}
        </div>
      </React.Fragment>
    );
  }
}

const Contacts = withRouter(ContactsComponent);
export { Contacts };
