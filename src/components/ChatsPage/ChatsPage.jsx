import React, { Component } from 'react';
import { Contacts } from '../Contacts/Contacts';
import { InfiniteScroller } from '../InfiniteScroller/InfiniteScroller';
import { Loader } from '../Loader/Loader';
import { Error } from '../Error/Error';
import { FETCH_ROOMS_ERROR } from '../../errorCodes';
import api from '../../api';
import { connect } from 'react-redux';
import { fetchMessages, setNext } from '../../store/actions/messagesActions';

class ChatsPageComponent extends Component {
  constructor() {
    super();
    this.fetchNext = this.fetchNext.bind(this);
  }

  componentDidMount() {
    this.fetchNext();
  }

  async fetchNext(next = this.props.next) {   
    try {
      if (next) {
        await this.fetchRooms(next);     
      }   
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  async fetchRooms(next) {  
    const res = await api.getCurrentUserRooms(next);
    await this.props.dispatch(setNext(res.next));    
    await Promise.all(
      res.items.map(async room => {
        await this.props.dispatch(fetchMessages(room._id));    
        await api.currentUserJoinRoom(room._id);
      }),
    );
    return res;
  }

  render() {
    const { rooms, error, next } = this.props;

    if (!Object.keys(rooms).length && !error) {
      return <Loader />;
    }

    const chats = Object.keys(rooms).map(key => ({
      _id: rooms[key].roomId,
      name: rooms[key].name,
      content: rooms[key].lastMessage,
      userCount: rooms[key].count,
      time: rooms[key].lastMessageTime,
      group: rooms[key].isChat
    })).sort((a, b) => a.time < b.time);

    return (
      <InfiniteScroller next={next} loadMore={this.fetchNext}>
        <Contacts contacts={chats} search="" />
        {error ? <Error code={FETCH_ROOMS_ERROR} /> : null}
      </InfiniteScroller>
    );
  }
}

const stateToProps = state => ({
  rooms: state.messages.rooms,
  next: state.messages.next,
  users: state.user.users,
  user: state.user.user
});

export const ChatsPage = connect(stateToProps)(ChatsPageComponent);


