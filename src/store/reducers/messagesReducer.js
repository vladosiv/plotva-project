import { MESSAGES_ACTION_TYPES } from '../actions/actionTypes';

const initialState = {
  next: true,
  currentChatName: '',
  rooms: []
}

export const messagesReducer = (state = initialState, action) => {
  switch (action.type) {

    case MESSAGES_ACTION_TYPES.MESSAGES_SET:{
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.payload.roomId]: action.payload
        }
      };}

    case MESSAGES_ACTION_TYPES.MESSAGES_APPENDED: {
      const rooms = state.rooms;
      const room = rooms[action.payload.roomId];

      if (room && room.messages.length > 0) {
        return {
          ...state,
          rooms: {
            ...rooms,
            [action.payload.roomId]: {
              ...room,
              messages: [...room.messages, ...action.payload.messages],
              next: action.payload.next
            },
          }
        };
      }
      return {
        ...state,
        rooms: {
          ...rooms,
          [action.payload.roomId]: {
            ...room,
            messages: [...action.payload.messages],
            next: null,
          },
        }
      };
    }

    case MESSAGES_ACTION_TYPES.MESSAGES_PREPENDED: {
      const rooms = state.rooms;
      const room = rooms[action.payload.roomId];

      if (room && room.messages.length > 0) {
        return {
          ...state,
          rooms: {
            ...rooms,
            [action.payload.roomId]: {
              ...room,
              messages: [...action.payload.messages, ...room.messages],
              next: action.payload.next,
              lastMessage: action.payload.messages[0].text,
              lastMessageTime: action.payload.messages[0].time
            },
          }
        };
      }
      return {
        ...state,
        rooms: {
          ...rooms,
          [action.payload.roomId]: {
            ...room,
            messages: [...action.payload.messages],
            next: null,
            lastMessage: action.payload.messages[0].text,
            lastMessageTime: action.payload.messages[0].time
          },
        }
      };
    }

    case MESSAGES_ACTION_TYPES.MESSAGES_ADD_USER_TO_ROOM: {
      const {userId, roomId} = action.payload;
      const rooms = state.rooms;
      const room = rooms[roomId];
      if (room) {
        return {
          ...state,
          rooms: {
            ...rooms,
            [room.roomId]: {
              ...room,
              users: [...room.users, userId],
              count: ++room.count
            },
          }
        };
      }
      return state;
    }

    case MESSAGES_ACTION_TYPES.MESSAGES_CURRENT_USER_LEAVE_ROOM: {
      const rooms = state.rooms;
      Reflect.deleteProperty(rooms, action.payload);

      return {
        ...state,
        rooms: rooms
      };
    }

    case MESSAGES_ACTION_TYPES.MESSAGES_SET_NEXT:
    return {
      ...state,
      next: action.payload
    } 

    case MESSAGES_ACTION_TYPES.MESSAGES_SET_CURRENT_ROOM:
      return {
        ...state,
        currentRoomId: action.payload
      } 

      case MESSAGES_ACTION_TYPES.MESSAGES_SET_EDIT_ROOM:
      return {
        ...state,
        editRoomId: action.payload
      } 

    case MESSAGES_ACTION_TYPES.MESSAGES_SET_CHAT_NAME:
      return {
        ...state,
        currentChatName: action.payload,
      };

    default:
      return state;
  }
};
