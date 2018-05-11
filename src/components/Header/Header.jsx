import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import { Icon} from "../Icon/Icon";
import { HeaderTitle } from "../HeaderTitle/HeaderTitle";
import { HeaderBtn } from "../HeaderBtn/HeaderBtn";
import { Avatar } from "../Avatar/Avatar";
import './Header.css';
import api from '../../api';
import { deselectUsers } from '../../store/actions/userActions';
import { setCurrentRoom, setEditRoom, addUserToRoom, currentUserLeaveRoom } from '../../store/actions/messagesActions';


import { connect } from 'react-redux';

class HeaderComponent extends Component {

  componentWillMount() {
    const defaultLocations = [
      "/contacts",
      "/chats",
      "/profile",
      "/create_chat"
    ]
    if (
      !this.props.currentRoomId &&
      !defaultLocations.includes(this.props.history.location.pathname)
    )
    {
      this.props.history.push(`/chats`);
    }
  }

  goToEdit = async () => {
    this.props.history.push(`/add_to_chat`);
  }

  addToChat = async () => {
    const {selectedUsers, rooms, currentRoomId, dispatch, history} = this.props;
    const room = rooms && rooms[currentRoomId];
    if(selectedUsers.length) {
      for (let i = 0; i < selectedUsers.length; i++) {
        await api.userJoinRoom(selectedUsers[i]._id, room.roomId);
        dispatch(
          addUserToRoom({userId: selectedUsers[i]._id, roomId: room.roomId})
        );
      }
      dispatch(setEditRoom('')); 
      history.push(`/chat`);
    }
  }

  newChat = async () => {
    const {user, selectedUsers, chatName, dispatch, history} = this.props;
    let newChatName = chatName;
    try {
      if(!chatName){
        newChatName = [user, ...selectedUsers].map(user => user.name).join(', ')
      }
      const rooms = await api.getRooms({ name: newChatName });
      if (!rooms.count && selectedUsers.length) {
        const room = await this.createRoomWithUsers(newChatName, [user, ...selectedUsers]);
        dispatch(deselectUsers());
        dispatch(setCurrentRoom(room._id)); 
        history.push(`/chat`);
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

  leaveChat = async () => {
    const {rooms, currentRoomId, dispatch} = this.props;
    const room = rooms && rooms[currentRoomId];
    
    try {
      await api.currentUserLeaveRoom(room.roomId);
      dispatch(currentUserLeaveRoom(room.roomId));
      this.props.history.push(`/chats`);
    } catch (err) {
      this.setState({ error: 'Произошла при выходе из комнаты.' });
    }
  }

  render() {
    let {title, subtitle, type = "chats", rooms, currentRoomId, withToggle, history, toggleAction} = this.props;
    let size = subtitle ? "lg" : "sm";
    let isChat;
    const room = rooms && rooms[currentRoomId];

    if ((type === "dialog" || type === "edit_chat") && room) {
      title = (room && room.name) || 'Loading...';
      isChat = room.isChat;      
      subtitle = isChat ? ((room && `${room.count} members`) || 'Loading...') : undefined;
    }

    return (
      <div className={`header header_${size}`}>
        <div className="header__left">
          {
            (
              type === "dialog" ||
              type === "edit_chat" ||
              (type === "contacts" && withToggle)
            )
            &&
            <HeaderBtn onClick={history.goBack} type="back" txt="Back" />
          }
        </div>
        {
          title && 
          <div className="header__center">
            <HeaderTitle
              title={title}
              subtitle={subtitle}
              isChat={isChat}
            />
            {
              type === "edit_chat" && 
              <Icon type="sign-out" onClick = {this.leaveChat}/>
            }
          </div>
        }
        <div className="header__right">
          {
            (type === "contacts" || type === "edit_chat") && withToggle &&
            <Icon type="header-add" onClick = {this[toggleAction]}/>
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
