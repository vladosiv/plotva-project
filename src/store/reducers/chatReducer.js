import { SET_CHAT_INFO, CLEAR_CHAT_INFO, SET_CHAT_ROOMS, SET_CHAT_NEXT } from '../actions/actionTypes';

const defaultState = {
  title: '',
  subtitle: '',
  rooms: [],
  next: null,
  error: null
};

export const chatReducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case SET_CHAT_INFO:
      return {
        ...state,
        title: payload.title,
        subtitle: payload.subtitle,
      };
    case SET_CHAT_ROOMS:
      return {
        ...state,
        rooms: payload,
      };
    case SET_CHAT_NEXT:
      return {
        ...state,
        next: payload,
      };

    case CLEAR_CHAT_INFO:
      return { ...defaultState };

    default:
      return state;
  }
};
