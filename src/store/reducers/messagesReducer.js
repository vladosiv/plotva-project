import { MESSAGES_ACTION_TYPES } from '../actions/actionTypes';

export const messagesReducer = (state = {next: true, currentChatName: ''}, action) => {
  switch (action.type) {
    case MESSAGES_ACTION_TYPES.MESSAGES_SET:
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.payload.roomId]: action.payload
        }
      };
    case MESSAGES_ACTION_TYPES.MESSAGES_APPENDED:
      if (state[action.payload.roomId] && state[action.payload.roomId].messages.length > 0) {
        return {
          ...state,
          rooms: {
            ...state.rooms,
            [action.payload.roomId]: {
              ...state[action.payload.roomId],
              messages: [...state[action.payload.roomId].messages, ...action.payload.messages],
              next: action.payload.next,
            },
          }
        };
      }
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.payload.roomId]: {
            messages: [...action.payload.messages],
            next: null,
          },
        }
      };

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
