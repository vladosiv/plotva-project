import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import { Icon} from "../Icon/Icon";
import { HeaderTitle } from "../HeaderTitle/HeaderTitle";
import { HeaderBtn } from "../HeaderBtn/HeaderBtn";
import { Avatar } from "../Avatar/Avatar";
import './Header.css';
import api from '../../api';
import { deselectUsers } from '../../store/actions/userActions';
import { setCurrentRoom, setEditRoom, addUserToRoom } from '../../store/actions/messagesActions';


import { connect } from 'react-redux';

class HeaderComponent extends Component {

  goToEdit = async () => {
    this.props.dispatch(setEditRoom(this.props.currentRoomId));
    this.props.history.push(`/add_to_chat`);
  }

  addToChat = async () => {
    const {selectedUsers, rooms, currentRoomId} = this.props;
    const room = rooms && rooms[currentRoomId];
    for (let i = 0; i < selectedUsers.length; i++) {
      await api.userJoinRoom(selectedUsers[i]._id, room.roomId)
      await this.props.dispatch(
        addUserToRoom({_id: selectedUsers[i]._id, roomId: room.roomId})
      ); 
    }
    this.props.dispatch(setEditRoom('')); 
    this.props.history.push(`/chat`);
  }

  newChat = async () => {
    const {user, selectedUsers} = this.props
    try {
      const rooms = await api.getRooms({ name: this.props.chatName });
      if (!rooms.count) {
        const room = await this.createRoomWithUsers(this.props.chatName, [user, ...selectedUsers]);
        this.props.dispatch(deselectUsers());
        this.props.dispatch(setCurrentRoom(room._id)); 
        this.props.history.push(`/chat`);
      }
    } catch (err) {
      this.setState({ error: 'Произошла ошибка.' });
    }
  };

  createRoomWithUsers = async (name, users) => {
    try {
      const room = await api.createRoom({ name, isChat: true, admin: this.props.user._id });
      for (let i = 0; i < users.length; i++) {
        await api.userJoinRoom(users[i]._id, room._id)
      }
      return room;
    } catch (err) {
      this.setState({ error: 'Произошла при создании комнаты.' });
    }
  };
  
  render() {
    let {title, subtitle, type = "chats", rooms, currentRoomId, withToggle, history, toggleAction} = this.props;
    let size = subtitle ? "lg" : "sm";
    let isChat;
    const room = rooms && rooms[currentRoomId];
    if (type === "dialog" && room) {
      title = (room && room.name) || 'Loading...';
      isChat = room.isChat;      
      subtitle = isChat ? ((room && `${room.count} members`) || 'Loading...') : undefined;
    }
    return (

      <div className={`header header_${size}`}>
        <div className="header__left">
          {
            (type === "dialog" ||
            (type === "contacts" && withToggle))
            &&
            <HeaderBtn onClick={history.goBack} type="back" txt="Back" />}
        </div>
        {title && (
          <div className="header__center">
            <HeaderTitle
              title={title}
              subtitle={subtitle}
              isChat={isChat}
            />
          </div>
        )}

        <div className="header__right">
          {
            type === "contacts" &&
            (
              withToggle
              ? <Icon type="header-add"
                  onClick = {this[toggleAction]}
                />
              : false
            )
          }
          {type === "chats"  && <Link to="/create_chat"><Icon type="header-write" /></Link>}
          {type === "search" && <Link to="/contacts"><Header type='action' txt="Cancel"/></Link>}
          {type === "dialog" && isChat && <Link to="/edit_chat"><Avatar size="xsmall" name={room.name}/></Link>}
        </div>
      </div>
    );
  }
}

const stateToProps = state => ({
  selectedUsers: state.user.selectedUsers,
  chatName: state.messages.currentChatName,
  user: state.user.user,
  users: state.user.users,
  rooms: state.messages.rooms,
  currentRoomId: state.messages.currentRoomId  
});

export const Header = connect(stateToProps)(withRouter(HeaderComponent));
