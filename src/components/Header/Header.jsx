import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import { Icon} from "../Icon/Icon";
import { HeaderTitle } from "../HeaderTitle/HeaderTitle";
import { HeaderBtn } from "../HeaderBtn/HeaderBtn";
import { Avatar } from "../Avatar/Avatar";
import './Header.css';
import api from '../../api';

import {
  createNewChat,
  currentUserLeaveRoom,
  addUsersToChat
} from '../../store/actions/messagesActions';


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
    this.props.dispatch(addUsersToChat());
    this.props.history.push(`/chat`);
  }
  
  newChat = async () => {
    this.props.dispatch(createNewChat());
    this.props.history.push(`/chat`);
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
            <HeaderTitle title={title} subtitle={subtitle} isChat={isChat} />
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
  rooms: state.messages.rooms,
  currentRoomId: state.messages.currentRoomId  
});

export const Header = connect(stateToProps)(withRouter(HeaderComponent));
