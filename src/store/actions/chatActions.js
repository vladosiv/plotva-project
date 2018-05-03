import { SET_CHAT_INFO, CLEAR_CHAT_INFO, SET_CHAT_NAME, SET_CHAT_ROOMS, SET_CHAT_NEXT } from './actionTypes';
import api from '../../api';

export const setChatName = query => ({
  type: SET_CHAT_NAME,
  payload: query,
});


export const setChatInfo = payload => {
  return {
    payload,
    type: SET_CHAT_INFO,
  };
};

export const clearChatInfo = () => {
  return {
    type: CLEAR_CHAT_INFO,
  };
};

export const fetchChat = roomId => async (dispatch, getState) => {
  const room = await api.getRoom(roomId);
  if (room) {
    dispatch(setChatInfo({ title: room.name, subtitle: `${room.users.length} members` }));
  }
};

export const setRooms = payload => {
  return {
    payload,
    type: SET_CHAT_ROOMS,
  };
};

export const setChatNext = payload => {
  return {
    payload,
    type: SET_CHAT_NEXT,
  };
};

export const clearChat = () => dispatch => {
  dispatch(clearChatInfo());
};
