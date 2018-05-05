import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { MessagesList } from '../MessagesList/MessagesList';
import { fetchMessages } from '../../store/actions/messagesActions';
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
    this.fetchNext((rooms[match.params.id] && rooms[match.params.id].next) || true);
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
      await this.props.fetchMessages(this.props.match.params.id);
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  render() {
    const { error } = this.state;
    const { rooms, match } = this.props;

    if (!rooms[match.params.id] && !error) {
      return <Loader />;
    }

    return (
      <InfiniteScroller loadMore={this.fetchNext}>
        {
          rooms[match.params.id]
          ? <MessagesList messages={rooms[match.params.id].messages} />
          : false
        }
        {error ? <Error code={FETCH_MESSAGES_ERROR} /> : null}
      </InfiniteScroller>
    );
  }
}

const stateToProps = state => ({
  user: state.user.user,
  rooms: state.messages.rooms,
});

export const Chat = withRouter(connect(stateToProps, { fetchMessages })(ChatComponent));
