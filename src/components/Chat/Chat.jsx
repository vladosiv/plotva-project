import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { MessagesList } from '../MessagesList/MessagesList';
import { fetchMessages } from '../../store/actions/messagesActions';
import { addUsers } from '../../store/actions/userActions';
import { Error } from '../Error/Error';
import { Loader } from '../Loader/Loader';
import { FETCH_MESSAGES_ERROR } from '../../errorCodes';
import api from '../../api';

class ChatComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      error: null,
    };
    this.fetchNext = this.fetchNext.bind(this);
  }

  componentDidMount() {
    const {rooms, currentRoomId} = this.props;
    this.fetchNext((rooms && rooms[currentRoomId] && rooms[currentRoomId].next) || true);
    this.getChatUsers();
  }

  componentDidUpdate(){
    this.getChatUsers();    
  }

  async fetchNext() {
    try {
      await this.props.dispatch(fetchMessages(this.props.currentRoomId));
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  async getChatUsers() {
    const { rooms, currentRoomId, users } = this.props;
    const room = rooms && rooms[currentRoomId];
    if (room) {
      const chatUsers = [];
      room.users.forEach(async id => {
        if(!users.find(user => user._id === id)) {
          chatUsers.push(api.getUser(id));
        }
      });
      let result = await Promise.all(chatUsers);
      if(result.length) {
        await this.props.dispatch(addUsers(result));
      }
    }
  }

  render() {
    const { error } = this.state;
    if (error) {
      return <Error code={FETCH_MESSAGES_ERROR} />
    };

    const { rooms, currentRoomId, users, user } = this.props;
    const room = rooms && rooms[currentRoomId];
    if (!room) {
      return <Loader />;
    }

    let chatUsers = [];
    if(users) {
      chatUsers = [user, ...users].filter(user => room.users.includes(user._id));
    }

    return (
      <InfiniteScroller loadMore={this.fetchNext} next={room.next} reverse>
        <MessagesList messages={room.messages} chatUsers={chatUsers} isChat={room.isChat}/>
      </InfiniteScroller>
    );
  }
}

const stateToProps = state => ({
  user: state.user.user,
  users: state.user.users,
  rooms: state.messages.rooms,
  currentRoomId: state.messages.currentRoomId  
});

export const Chat = connect(stateToProps)(ChatComponent);
