import React, { PureComponent } from 'react';

import { Contacts } from '../Contacts/Contacts';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';

import { Error } from '../Error/Error';
import { FETCH_CONTACTS_ERROR } from '../../errorCodes';
import { connect } from 'react-redux';
import { setEditRoom, setCurrentRoom } from '../../store/actions/messagesActions';


class ChatUserListComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      error: null,
    };
  }

  componentDidMount() {
    const {currentRoomId, editRoomId, dispatch} = this.props;

    currentRoomId && !editRoomId
    ? dispatch(setEditRoom(currentRoomId))     
    : dispatch(setCurrentRoom(editRoomId));
  }

  componentWillUnmount() {
    const {currentRoomId, editRoomId, dispatch} = this.props;
    if (currentRoomId === editRoomId) {
      dispatch(setEditRoom(''));      
    }
  }

  render() {
    const { error } = this.state;
    const { users, user, rooms, currentRoomId } = this.props;
    const room = rooms && rooms[currentRoomId];
    let newUsers = [];

    if (room) {
      newUsers = [...users].filter(user => rooms[currentRoomId].users.includes(user._id));
    }
    
    return (
      <React.Fragment>
        <SectionTitle title="Contacts" />
        <InfiniteScroller className={'infinite-scroller_chat-members'}>        
          <Contacts type="contactList" contacts={newUsers} user={user}/>
        </InfiniteScroller>
        {error ? <Error code={FETCH_CONTACTS_ERROR} /> : null}
      </React.Fragment>
    );
  }
}

const stateToProps = state => ({
  user: state.user.user,	
  users: state.user.users,
  rooms: state.messages.rooms,
  currentRoomId: state.messages.currentRoomId,
  editRoomId: state.messages.editRoomId,
});

export const ChatUserList = connect(stateToProps)(ChatUserListComponent);
