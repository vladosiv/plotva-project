import { USER_ACTION_TYPES } from '../actions/actionTypes';

export const userReducer = (state = {users: [], selectedUsers: []}, action) => {
  switch (action.type) {
    case USER_ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: action.user,
      };
      
    case USER_ACTION_TYPES.ADD_USERS: {
      const newUsers = action.users.map(user => {
        const status = user.online ? 'online' : 'offline';
        return {
            _id: user._id,
            name: user.name,
            img: user.img,
            size: 'small',
            content: status,
            contentType: status,
        };
      })
      return {
        ...state,
        users: [...state.users, ...newUsers]
      };
    }

    case USER_ACTION_TYPES.SET_NEXT:
      return {
        ...state,
        next: action.next,
      };
    case USER_ACTION_TYPES.SET_SELECTED:
      return {
        ...state,
        selectedUsers: action.users,
      };

    case USER_ACTION_TYPES.DESELECT_USERS:{
      const users = [].concat(state.users);
      users.forEach(user => {user.checked = false});
      return {
        ...state,
        users: users,
        selectedUsers: []
      };
    }

    default:
      return state;
  }
};
