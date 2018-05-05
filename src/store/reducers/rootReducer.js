import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { messagesReducer } from './messagesReducer';
import { searchReducer } from './searchReducer';
import { chatReducer } from './chatReducer';

export const rootReducer = combineReducers({
  user: userReducer,
  messages: messagesReducer,
  search: searchReducer,
  chat: chatReducer,
});
