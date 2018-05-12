import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { messagesReducer } from './messagesReducer';

export const rootReducer = combineReducers({
  user: userReducer,
  messages: messagesReducer
});
