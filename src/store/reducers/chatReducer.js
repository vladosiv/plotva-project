import { CHAT_ACTION_TYPES } from '../actions/actionTypes';

const defaultState = {
  currentChatName: ''
};

export const chatReducer = (state = defaultState, { type, payload }) => {
  switch (type) {

    case CHAT_ACTION_TYPES.SET_CHAT_NAME:
      return {
        ...state,
        currentChatName: payload,
      };

    default:
      return state;
  }
};
