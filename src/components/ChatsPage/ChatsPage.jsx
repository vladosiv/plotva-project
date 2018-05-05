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
    this.fetchNext(this.props.next);
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
    await Promise.all(
      res.items.map(async room => {
        await this.props.dispatch(fetchMessages(room._id));        
      }),
    );
    await this.props.dispatch(setNext(res.next))
    return res;
  }

  render() {
    const { rooms, error } = this.props;

    if (!rooms && !error) {
      return <Loader />;
    }

    const chats = Object.keys(rooms).map(key => ({
      _id: rooms[key].roomId,
      userName: rooms[key].name,
      content: rooms[key].lastMessage || 'No messages',
      userCount: rooms[key].count
    }))

    return (
      <InfiniteScroller next={this.props.next} loadMore={this.fetchNext}>
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
  user: state.user.user,
});

export const ChatsPage = connect(stateToProps)(ChatsPageComponent);


