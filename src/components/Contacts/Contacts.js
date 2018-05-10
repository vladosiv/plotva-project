import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Contact } from '../Contact/Contact';
import api from '../../api';
import { connect } from 'react-redux';
import { setCurrentRoom } from '../../store/actions/messagesActions';


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
        this.props.dispatch(setCurrentRoom(rooms.items[0]._id));
        this.props.history.push(`/chat`);
      }
    } catch (err) {
      this.setState({ error: 'Произошла ошибка.' });
    }
  };

  createRoomWithUser = async (name, userId) => {
    try {
      const room = await api.createRoom({ name });
      await this.joinUserToRoom(userId, room._id);
      this.props.dispatch(setCurrentRoom(room._id));            
      this.props.history.push(`/chat`);
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
    const {contacts, search, withToggle, user, toggle} = this.props;
    return (
      <React.Fragment>
        <div className="contacts">
          {
            contacts.map((contact, index) => {
              
              const props = {};
              if (user) {
                props.onClick = withToggle ? () => toggle(contact) : this.getChatId(contact);
              } else {
                props.onClick = () => this.props.dispatch(setCurrentRoom(contact._id));            
                props.link = `/chat`;
              }

              const shouldRender = search === undefined
              ? true
              : contact.name.toLowerCase().indexOf(search.toLowerCase()) >= 0
              

              if (shouldRender) {
                return <Contact key={index} color={`${index}`} {...props} {...contact} />;
              }

              return null;
            })
          }
          {this.state.error}
        </div>
      </React.Fragment>
    );
  }
}

const stateToProps = state => ({});

export const Contacts = withRouter(connect(stateToProps)(ContactsComponent));
