import React, { PureComponent } from 'react';

import { Contacts } from '../Contacts/Contacts';
import { SectionTitle } from '../SectionTitle/SectionTitle';

import { Error } from '../Error/Error';
import { FETCH_CONTACTS_ERROR } from '../../errorCodes';
import { connect } from 'react-redux';


class ChatUserListComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      error: null,
    };
  }

  render() {
    const { error } = this.state;
    const { users, user, rooms, currentRoomId } = this.props;

    const newUsers = [...users].filter(user => rooms[currentRoomId].users.includes(user._id));
    
    return (
      <React.Fragment>
        <SectionTitle title="Contacts" />        
          <Contacts
            type="contactList"
						contacts={newUsers}
						user={user}
          />
          {error ? <Error code={FETCH_CONTACTS_ERROR} /> : null}
      </React.Fragment>
    );
  }
}

const stateToProps = state => ({
  user: state.user.user,	
  users: state.user.users,
  rooms: state.messages.rooms,
  currentRoomId: state.messages.currentRoomId
});

export const ChatUserList = connect(stateToProps)(ChatUserListComponent);
