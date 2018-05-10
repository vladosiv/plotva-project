import { MESSAGES_ACTION_TYPES } from './actionTypes';
import { addUsers } from './userActions';
import api from '../../api';

export const setRoom = payload => ({
  type: MESSAGES_ACTION_TYPES.MESSAGES_SET,
  payload,
});

export const appendMessages = payload => ({
  type: MESSAGES_ACTION_TYPES.MESSAGES_APPENDED,
  payload,
});

export const prependMessages = payload => ({
  type: MESSAGES_ACTION_TYPES.MESSAGES_PREPENDED,
  payload,
});

export const setNext = payload => ({
  type: MESSAGES_ACTION_TYPES.MESSAGES_SET_NEXT,
  payload,
});

export const setCurrentRoom = payload => ({
  type: MESSAGES_ACTION_TYPES.MESSAGES_SET_CURRENT_ROOM,
  payload,
});

export const setEditRoom = payload => ({
  type: MESSAGES_ACTION_TYPES.MESSAGES_SET_EDIT_ROOM,
  payload,
});

export const addUserToRoom = payload => ({
  type: MESSAGES_ACTION_TYPES.MESSAGES_ADD_USER_TO_ROOM,
  payload,
});

const getMessages = (messages, currentUserId) => 
  messages.map(message => ({
    id: message._id,
    userId: message.userId,    
    text: message.message,
    time: message.created_at,
    isMy: currentUserId === message.userId,
  }));

export const fetchMessages = roomId => async (dispatch, getState) => {
  const room = getState().messages.rooms[roomId];
  const currentUserId = getState().user.user._id;
  const users = getState().user.users;

  let next = room ? room.next : true;
  const hasMessages = room && room.messages.length > 0;
  
  let response;  

  if(next) {
    next = {
      ...next,
      lastCreatedAt: true
    }
  }

  try {
    if (!hasMessages && next) {
      let roomName;
      const room = await api.getRoom(roomId);      
      response = await api.getRoomMessages(roomId);
      const messages = getMessages(response.items, currentUserId);
      if (!room.isChat) {
        const recepientId = room.users.find(roomUserID => roomUserID !== currentUserId);        
        let recepient = users.find(user => user._id === recepientId);
        if(!recepient) {
          recepient = await api.getUser(recepientId);
          dispatch(addUsers([recepient]));
        }
        roomName = recepient.name;
      } else {
        roomName = room.name;
      }
      
      dispatch(setRoom({
        roomId,
        name: roomName,
        lastMessage: (messages[0] && messages[0].text) || 'No messages',
        lastMessageTime: (messages[0] && messages[0].time) || '',
        messages,
        isChat: room.isChat,
        admin: room.admin,
        users: room.users,
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

export const sendMessage = (messageText) => async (dispatch, getState) => {
  try {
    const currentUserId = getState().user.user._id;
    const roomId = getState().messages.currentRoomId;
    const response = await api.sendMessage(roomId, messageText);
    const message = getMessages([response], currentUserId);
    dispatch(prependMessages({ roomId, messages: message }));
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const setChatName = query => ({
  type: MESSAGES_ACTION_TYPES.MESSAGES_SET_CHAT_NAME,
  payload: query,
});



  

