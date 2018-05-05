import { CHAT_ACTION_TYPES } from './actionTypes';

export const setChatName = query => ({
  type: CHAT_ACTION_TYPES.SET_CHAT_NAME,
  payload: query,
});
