import React, { Component } from 'react';
import { Contacts } from '../Contacts/Contacts';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { NoResults } from '../NoResults/NoResults';
import { Error } from '../Error/Error';
import { FETCH_ROOMS_ERROR } from '../../errorCodes';
import api from '../../api';
import { connect } from 'react-redux';
import { setRooms, setChatNext } from '../../store/actions/chatActions';



class ChatsPageComponent extends Component {
  constructor() {
    super();
    this.fetchNext = this.fetchNext.bind(this);
  }

  componentDidMount() {
    if(!this.props.rooms.length) {
      this.fetchNext(this.props.next || true);
    }
  }

  async fetchNext(next = this.props.next) {
    try {
      if (next) {
        const response = await this.fetchRooms(next);
        this.props.dispatch(
          setRooms([...this.props.rooms, ...response.rooms])
        );
        this.props.dispatch(
          setChatNext(response.next)
        );
        return response;
      }
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  async fetchRooms(next) {
    const {user} = this.props;    
    const res = await api.getCurrentUserRooms(next);
    const rooms = await Promise.all(
      res.items.map(async room => {
        const roomMessages = await api.getRoomMessages(room._id);
        const messages = roomMessages.items;

        let recepient = await api.getUser(
          room.users.find(
            roomUserID => roomUserID !== user._id
          )
        );

        const chatName = room.users.length > 2 ? room.name : recepient.name;
        const lastMessage = messages[messages.length - 1] && messages[messages.length - 1].message;
        return {
          _id: room._id,
          userName: chatName,
          content: lastMessage || 'No messages',
        };
      }),
    );
    return {
      rooms,
      next: res.next,
    };
  }

  render() {
    const { rooms, error } = this.props;
    if (!rooms.length && !error) {
      return <NoResults text="No chats here yet..." />;
    }

    return (
      <InfiniteScroller hasMore={!!this.next} loadMore={this.fetchNext}>
        <Contacts contacts={rooms} search="" />
        {error ? <Error code={FETCH_ROOMS_ERROR} /> : null}
      </InfiniteScroller>
    );
  }
}

const stateToProps = state => ({
  rooms: state.chat.rooms,
  next: state.chat.next,
  error: state.chat.error,
  users: state.user.users,
  user: state.user.user,
});

export const ChatsPage = connect(stateToProps)(ChatsPageComponent);


