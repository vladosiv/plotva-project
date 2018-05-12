import { USER_ACTION_TYPES } from './actionTypes';
import api from '../../api';

export const setUser = user => ({
  type: USER_ACTION_TYPES.SET_USER,
  user,
});

export const setUsers = users => ({
  type: USER_ACTION_TYPES.SET_USERS,
  users,
});

export const toggleUser = user => ({
  type: USER_ACTION_TYPES.TOGGLE_USER,
  user,
});

export const addUsers = users => ({
  type: USER_ACTION_TYPES.ADD_USERS,
  users,
});

export const setNext = next => ({
  type: USER_ACTION_TYPES.SET_NEXT,
  next,
});

export const setSelectedUsers = users => ({
  type: USER_ACTION_TYPES.SET_SELECTED,
  users,
});

export const deselectUsers = users => ({
  type: USER_ACTION_TYPES.DESELECT_USERS,
  users,
});

export const setSearch = payload => ({
  type: USER_ACTION_TYPES.SET_SEARCH,
  payload,
});

export const getCurrentChatUsers = () => async (dispatch, getState) => {
  const users = getState().user.users; 
  const rooms = getState().messages.rooms;
  const currentRoomId = getState().messages.currentRoomId;
  const room = rooms[currentRoomId];

  if (room) {
    const chatUsers = [];
    room.users.forEach(async id => {
      if(!users.find(user => user._id === id)) {
        chatUsers.push(api.getUser(id));
      }
    });
    if (chatUsers.length) {
      this.setState({fethingUsers: true}); 
      let result = await Promise.all(chatUsers);
      await dispatch(addUsers(result));
    }
  }
  return true;
};
