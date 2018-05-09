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

  componentDidMount() {
    const {rooms, match} = this.props;
    this.joinRoom();
    this.fetchNext((rooms && rooms[match.params.id] && rooms[match.params.id].next) || true);
  }

  componentDidUpdate(){
    const { rooms, match, users } = this.props;
    const room = rooms && rooms[match.params.id];
    if(room){
      this.getChatUsers(room, users);    
    }
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

  async getChatUsers(room, users) {
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

  render() {
    const { error } = this.state;
    const { rooms, match, users, user } = this.props;
    const room = rooms && rooms[match.params.id];
    if (!room && !error) {
      return <Loader />;
    }

    let chatUsers = [];
    if(users) {
      chatUsers = [user, ...users].filter(user => room.users.includes(user._id));
    }

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
