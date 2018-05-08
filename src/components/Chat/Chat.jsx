import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
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

  async componentDidMount() {
    const {rooms, match} = this.props;
    this.joinRoom();
    await this.fetchNext((rooms && rooms[match.params.id] && rooms[match.params.id].next) || true);
    this.getChatUsers();
  }

  async joinRoom() {
    try {
      await api.currentUserJoinRoom(this.props.match.params.id);
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  async fetchNext() {
    try {
      await this.props.dispatch(fetchMessages(this.props.match.params.id));
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  async getChatUsers() {
    const { rooms, match, users } = this.props;
    const room = rooms && rooms[match.params.id];
    const chatUsers = await Promise.all(room.users.map(async id => {
      if(!users.find(user => user._id === id)) {
        let user = await api.getUser(id);
        const status = user.online ? 'online' : 'offline';
        return {
            _id: user._id,
            userName: user.name,
            avatar: user.img,
            size: 'small',
            content: status,
            contentType: status,
        };
      }
    }));
    await this.props.dispatch(addUsers(chatUsers));
  }

  render() {
    const { error } = this.state;
    const { rooms, match, users } = this.props;
    const room = rooms && rooms[match.params.id];
    if (!room && !error) {
      return <Loader />;
    }
    const chatUsers = users.length && room.users.map(id => users.find(user => user._id === id));

    return (
      <InfiniteScroller loadMore={this.fetchNext} next={room.next} reverse>
        {
          room
          ? <MessagesList messages={room.messages} chatUsers={chatUsers} isChat={room.isChat}/>
          : false
        }
        {error ? <Error code={FETCH_MESSAGES_ERROR} /> : null}
      </InfiniteScroller>
    );
  }
}

const stateToProps = state => ({
  user: state.user.user,
  users: state.user.users,
  rooms: state.messages.rooms,
});

export const Chat = withRouter(connect(stateToProps)(ChatComponent));
