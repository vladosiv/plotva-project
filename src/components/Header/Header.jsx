import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import { Icon} from "../Icon/Icon";
import { SearchInput } from "../SearchInput/SearchInput";
import { HeaderTitle } from "../HeaderTitle/HeaderTitle";
import { HeaderBtn } from "../HeaderBtn/HeaderBtn";
import { Avatar } from "../Avatar/Avatar";
import './Header.css';
import api from '../../api';
import { setSelectedUsers, setUsers, deselectUsers } from '../../store/actions/userActions';


import { connect } from 'react-redux';

class HeaderComponent extends Component {
  
   newChat = async () => {
    const {user, selectedUsers} = this.props
    try {
      const rooms = await api.getRooms({ name: this.props.chatName });
      if (!rooms.count) {
        const room = await this.createRoomWithUsers(this.props.chatName, [user, ...selectedUsers]);
        this.props.dispatch(deselectUsers());
        this.props.history.push(`/chat/${room._id}`);
      }
    } catch (err) {
      this.setState({ error: 'Произошла ошибка.' });
    }
  };

  createRoomWithUsers = async (name, users) => {
    try {
      const room = await api.createRoom({ name });
      for (let i = 0; i < users.length; i++) {
        await api.userJoinRoom(users[i]._id, room._id)
      }
      return room;
    } catch (err) {
      this.setState({ error: 'Произошла при создании комнаты.' });
    }
  };
  
  render() {
    let {title, subtitle, type = "chats", rooms, match} = this.props;
    let size = subtitle ? "lg" : "sm";
    if(type === "dialog") {
      const room = rooms[match.params.id];
      title = (room && room.name) || 'Loading...';
      subtitle = (room && `${room.count} members`) || 'Loading...';
    }
    return (

      <div className={`header header_${size}`}>
        <div className="header__left">
          {type === "search" && <SearchInput />}
          {type === "dialog" && <HeaderBtn onClick={this.props.history.goBack} type="back" txt="Back" />}
        </div>

        {title && (
          <div className="header__center">
            <HeaderTitle
              title={title}
              subtitle={subtitle}
            />
          </div>
        )}

        <div className="header__right">
          {
            type === "contacts" &&
            (
              this.props.createChat
              ? <Icon type="header-add" onClick = {this.newChat}/>
              : false
            )
          }
          {type === "chats"  && <Link to="/create_chat"><Icon type="header-write" /></Link>}
          {type === "search" && <Link to="/contacts"><Header type='action' txt="Cancel"/></Link>}
          {type === "dialog" && <Avatar size="xsmall" />}
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
  rooms: state.messages.rooms
});

export const Header = connect(stateToProps)(withRouter(HeaderComponent));
