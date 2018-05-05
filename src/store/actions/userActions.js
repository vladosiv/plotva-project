import { USER_ACTION_TYPES } from './actionTypes';

export const setUser = user => ({
  type: USER_ACTION_TYPES.SET_USER,
  user,
});

export const setUsers = users => ({
  type: USER_ACTION_TYPES.SET_USERS,
  users,
});

export const setNext = next => ({
  type: USER_ACTION_TYPES.SET_NEXT,
  next,
});

export const setSelectedUsers = users => ({
  type: USER_ACTION_TYPES.SET_SELECTED,
  users,
});
