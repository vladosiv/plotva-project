import { SEARCH_ACTION_TYPES } from './actionTypes';

export const setSearch = payload => ({
  type: SEARCH_ACTION_TYPES.SET_SEARCH,
  letters: payload,
});
