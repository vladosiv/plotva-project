import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { MessagesList } from '../MessagesList/MessagesList';
import { fetchMessages } from '../../store/actions/messagesActions';
import { getCurrentChatUsers } from '../../store/actions/userActions';
import { Error } from '../Error/Error';
import { Loader } from '../Loader/Loader';
import { FETCH_MESSAGES_ERROR } from '../../errorCodes';

class ChatComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      error: null,
      fethingUsers: false
    };
    this.fetchNext = this.fetchNext.bind(this);
  }

  componentDidMount() {
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
    if (!this.state.fethingUsers) {
      await getCurrentChatUsers();
      this.setState({fethingUsers: false});               
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
      this.fetchNext();
      return <Loader />;
    }

    let chatUsers = [];
    if (users) {
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
