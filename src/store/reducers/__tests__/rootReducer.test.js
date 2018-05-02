import { createStore } from 'redux';
import { rootReducer } from '../rootReducer';
import { userReducer } from '../userReducer';
import { messagesReducer } from '../messagesReducer';
import { SET_USER, MESSAGES_SET } from '../../actions/actionTypes';

describe('Redux: Root Reducer', () => {
  it('should return initial state that matchs what child reducers return given an empty action', () => {
    const store = createStore(rootReducer);
    expect(store.getState().user).toEqual(userReducer(undefined, {}));
    expect(store.getState().messages).toEqual(messagesReducer(undefined, {}));
  });

  it('should verify, that child reducers handle its actions', () => {
    const store = createStore(rootReducer);
    const userAction = { type: SET_USER, user: { id: '1', name: 'Test Name', email: 'redux@test.com', phone: '123' } };
    const messageAction = {
      type: MESSAGES_SET,
      payload: {
        roomId: '123',
        next: null,
        messages: [{ id: '1', text: 'Test text', isMy: true, time: '2018-14-04' }],
      },
    };
    store.dispatch(userAction);
    store.dispatch(messageAction);
    expect(store.getState().user).toEqual(userReducer(undefined, userAction));
    expect(store.getState().messages).toEqual(messagesReducer(undefined, messageAction));
  });
});
