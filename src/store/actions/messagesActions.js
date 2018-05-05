import { MESSAGES_ACTION_TYPES } from './actionTypes';
import api from '../../api';

export const setRoom = payload => ({
  type: MESSAGES_ACTION_TYPES.MESSAGES_SET,
  payload,
});

export const appendMessages = payload => ({
  type: MESSAGES_ACTION_TYPES.MESSAGES_APPENDED,
  payload,
});

export const setNext = payload => ({
  type: MESSAGES_ACTION_TYPES.MESSAGES_SET_NEXT,
  payload,
});

export const fetchMessages = roomId => async (dispatch, getState) => {
  const room = getState().messages.rooms[roomId];
  const currentUserId = getState().user.user._id;
  const hasMessages = room && room.messages.length > 0;
  let next = (room && room.next) || null;

  if (next) {
    next = {
      ...next,
      order: { created_at: -1 },
    };
  }

  let response;
  try {
    if (!hasMessages) {
      const room = await api.getRoom(roomId);      
      response = await api.getRoomMessages(roomId);

      const messages = getMessages(response.items, currentUserId);
      const last = messages.length && messages.length - 1;
      const lastMessage = messages[last] && messages[last].text;

      let recepient = await api.getUser(
        room.users.find(roomUserID => roomUserID !== currentUserId)
      );

      const name = room.users.length > 2 ? room.name : recepient.name;
      
      dispatch(setRoom({
        roomId,
        name,
        lastMessage,
        messages,
        count: room.users.length,
        next: response.next
      }));

    } else if (hasMessages && next) {
      response = await api.getMessages(next);
      const messages = getMessages(response.items, currentUserId);

      dispatch(appendMessages({ roomId, messages, next: response.next }));
    } else {
      return;
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const sendMessage = (roomId, messageText) => async (dispatch, getState) => {
  try {
    const currentUserId = getState().user.user._id;
    const response = await api.sendMessage(roomId, messageText);
    const message = [
      {
        id: response._id,
        text: response.message,
        time: response.created_at,
        isMy: currentUserId === response.userId,
      },
    ];

    dispatch(appendMessages({ roomId, messages: message }));
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const setChatName = query => ({
  type: MESSAGES_ACTION_TYPES.SET_CHAT_NAME,
  payload: query,
});

const getMessages = (messages, currentUserId) => 
  messages.map(message => ({
    id: message._id,
    text: message.message,
    time: message.created_at,
    isMy: currentUserId === message.userId,
  }));

  

