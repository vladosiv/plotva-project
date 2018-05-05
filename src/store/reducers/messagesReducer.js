import { MESSAGES_ACTION_TYPES } from '../actions/actionTypes';

const initialState = {
  next: true,
  currentChatName: '',
  rooms: []
}

export const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGES_ACTION_TYPES.MESSAGES_SET:
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.payload.roomId]: action.payload
        }
      };
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
              next: action.payload.next,
              lastMessage: action.payload.messages[action.payload.messages.length - 1].text
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

    case MESSAGES_ACTION_TYPES.MESSAGES_SET_NEXT:
      return {
        ...state,
        next: action.payload
      } 

    case MESSAGES_ACTION_TYPES.SET_CHAT_NAME:
      return {
        ...state,
        currentChatName: action.payload,
      };

    default:
      return state;
  }
};
