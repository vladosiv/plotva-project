import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Contact } from '../Contact/Contact';
import { connect } from 'react-redux';
import { setCurrentRoom, goToDialog } from '../../store/actions/messagesActions';
import { toggleUser } from '../../store/actions/userActions';
import api from '../../api';



import './Contacts.css';

class ContactsComponent extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
    };
  }

  toggle = contact => {
    this.props.dispatch(toggleUser(contact));
  }

  getChatId = contact => async e => {
    const currentUserId = this.props.user._id;
    const name = [currentUserId, contact._id].sort().toString();
    const rooms = await api.getRooms({ name });
    if (!rooms.count) {
      const room = await api.createRoom({ name });
      await api.userJoinRoom(contact._id, room._id);
      this.props.dispatch(setCurrentRoom(room._id));            
    } else {
      this.props.dispatch(setCurrentRoom(rooms.items[0]._id));
    }
    this.props.history.push(`/chat`);
  };

  render() {
    const {contacts, currentUserSearch, user, withToggle, withSearch} = this.props;
    return (
      <React.Fragment>
        <div className="contacts">
          {
            contacts.map((contact, index) => {
              
              const props = {};
              if (user) {
                props.onClick = withToggle ? () => this.toggle(contact) : this.getChatId(contact);
              } else {
                props.onClick = () => this.props.dispatch(setCurrentRoom(contact._id));            
                props.link = `/chat`;
              }

              const shouldRender = withSearch
              ? contact.name.toLowerCase().indexOf(currentUserSearch.toLowerCase()) >= 0
              : true;

              if (!contact.name){ contact.name = 'Nameless User' }
              
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

const stateToProps = state => ({
  currentUserSearch: state.user.currentUserSearch
});

export const Contacts = withRouter(connect(stateToProps)(ContactsComponent));
