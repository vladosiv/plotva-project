import { MESSAGES_ACTION_TYPES } from './actionTypes';
import { addUsers, deselectUsers } from './userActions';
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

export const currentUserLeaveRoom = payload => ({
  type: MESSAGES_ACTION_TYPES.MESSAGES_CURRENT_USER_LEAVE_ROOM,
  payload,
});

export const setChatName = payload => ({
  type: MESSAGES_ACTION_TYPES.MESSAGES_SET_CHAT_NAME,
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
      const room = await api.getRoom(roomId);      
      response = await api.getRoomMessages(roomId);
      const messages = getMessages(response.items, currentUserId);
      const lastMessageUserId = messages[0] && messages[0].userId;

      let roomName;
      let lastMessageUserName;

      if (lastMessageUserId) {
        if (lastMessageUserId === currentUserId){
          lastMessageUserName = 'You: ';
        } else {
          let lastMessageUser = users.find(user => user._id === lastMessageUserId);
          if (lastMessageUserId && !lastMessageUser) {
            lastMessageUser = await api.getUser(lastMessageUserId);
            dispatch(addUsers([lastMessageUser]));
          } 
          lastMessageUserName = `${lastMessageUser.name}: `;
        }
      } 

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
        messages,        
        lastMessage: (messages[0] && messages[0].text) || 'No messages',
        lastMessageTime: (messages[0] && messages[0].time) || '',
        lastMessageUserName,       
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

export const joinUserToRoom = (userId, roomId) => async (dispatch, getState) => {
  const room = getState().messages.rooms[roomId];
  if (!room) {
    dispatch(fetchMessages(roomId));
  } else {
    dispatch(addUserToRoom({userId, roomId}));    
  }
}

export const addUsersToChat = () => async (dispatch, getState) => {
  const currentRoomId = getState().messages.currentRoomId;
  const room = getState().messages.rooms[currentRoomId];
  const selectedUsers = getState().user.selectedUsers;

  if(selectedUsers.length) {
    for (let i = 0; i < selectedUsers.length; i++) {
      await api.userJoinRoom(selectedUsers[i]._id, room.roomId);
      dispatch(
        addUserToRoom({userId: selectedUsers[i]._id, roomId: room.roomId})
      );
    }
    dispatch(setEditRoom('')); 
  }
}

export const sendMessage = (messageText) => async (dispatch, getState) => {
  try {
    const currentUserId = getState().user.user._id;
    const roomId = getState().messages.currentRoomId;
    const response = await api.sendMessage(roomId, messageText);
    const message = getMessages([response], currentUserId);
    dispatch(prependMessages({ roomId, messages: message, lastMessageUserName: 'You: ' }));
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const createNewChat = () => async (dispatch, getState) => {
  const user = getState().user.user;
  const selectedUsers = getState().user.selectedUsers;
  let currentChatName = getState().messages.currentChatName;

  if(!currentChatName) {
    currentChatName = [user, ...selectedUsers].map(user => user.name).join(', ')
  };

  const rooms = await api.getRooms({ name: currentChatName });
  if (!rooms.count && selectedUsers.length) {
    const room = await createRoomWithUsers(currentChatName, [user, ...selectedUsers]);
    dispatch(deselectUsers());
    dispatch(setCurrentRoom(room._id)); 
  }
};

export const goToDialog = contact => async (dispatch, getState) => {
  const user = getState().user.user; 
  const name = [user._id, contact._id].sort().toString();

  let room = await api.getRooms({ name });

  if(!room.count){
    room = await api.createRoom({ name });
    await api.userJoinRoom(contact._id, room._id);
    dispatch(setCurrentRoom(room._id));
  } else {
    dispatch(setCurrentRoom(room.items[0]._id));
  }
};

const createRoomWithUsers = async (name, users, admin) => {
  const room = await api.createRoom({ name, isChat: true, admin: users[0]._id });
  for (let i = 0; i < users.length; i++) {
    await api.userJoinRoom(users[i]._id, room._id)
  }
  return room;
};
