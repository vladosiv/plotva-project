import { SEARCH_ACTION_TYPES } from '../actions/actionTypes';

export function searchReducer(state, action) {
  if (!state) {
    return {
      currentUserSearch: '',
    };
  }

  if (action.type === SEARCH_ACTION_TYPES.SET_SEARCH) {
    return {
      ...state,
      currentUserSearch: action.letters,
    };
  }

  return state;
}
